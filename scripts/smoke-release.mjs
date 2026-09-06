import process from 'node:process';

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';
const baseUrl = (process.argv[2] || process.env.SMOKE_BASE_URL || DEFAULT_BASE_URL).replace(
  /\/$/,
  '',
);
const pathPrefix = (process.env.SMOKE_PATH_PREFIX || '').replace(/\/$/, '');
const staticMode =
  process.env.SMOKE_STATIC === '1' ||
  process.env.SMOKE_STATIC === 'true' ||
  process.env.GITHUB_PAGES === 'true';
const fastApiHealthUrl = process.env.SMOKE_FASTAPI_HEALTH_URL?.trim() || '';
const waitTimeoutMs = 20_000;

function withPrefix(pathname) {
  if (!pathPrefix) {
    return pathname;
  }

  if (pathname === '/') {
    return `${pathPrefix}/`;
  }

  return `${pathPrefix}${pathname}`;
}

async function waitForBaseUrl(url) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < waitTimeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok || (response.status >= 200 && response.status < 400)) {
        return;
      }
    } catch { }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function expectHtml(pathname, expectedText, options = {}) {
  const { allowRedirect = false, maxRedirects = 5 } = options;
  let currentPath = pathname;
  let redirectsFollowed = 0;

  while (redirectsFollowed <= maxRedirects) {
    const response = await fetch(`${baseUrl}${currentPath}`, { redirect: 'manual' });

    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
      if (!allowRedirect) {
        throw new Error(`${pathname} returned HTTP ${response.status} (redirect not allowed)`);
      }

      const location = response.headers.get('location');
      if (!location) {
        throw new Error(`${pathname} returned redirect without Location header`);
      }

      const redirectUrl = new URL(location, baseUrl);
      currentPath = redirectUrl.pathname + redirectUrl.search;
      redirectsFollowed++;
      continue;
    }

    if (!response.ok) {
      throw new Error(`${pathname} returned HTTP ${response.status}`);
    }

    const html = await response.text();
    if (!html.includes(expectedText)) {
      throw new Error(`${pathname} did not include expected text: ${expectedText}`);
    }

    console.log(`OK ${currentPath} -> ${response.status}`);
    return;
  }

  throw new Error(`${pathname} exceeded maximum redirects (${maxRedirects})`);
}

async function expectJson(pathname, validate) {
  const response = await fetch(`${baseUrl}${pathname}`);
  if (!response.ok) {
    throw new Error(`${pathname} returned HTTP ${response.status}`);
  }

  const data = await response.json();
  validate(data);
  console.log(`OK ${pathname} -> ${response.status}`);
}

async function expectChatPost() {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hello' }],
      agent: 'screening',
    }),
  });

  if (!response.ok) {
    throw new Error(`/api/chat POST returned HTTP ${response.status}`);
  }

  const data = await response.json();
  if (typeof data.content !== 'string' || data.content.trim().length === 0) {
    throw new Error('/api/chat POST did not return assistant content');
  }

  if (typeof data.source !== 'string' || data.source.length === 0) {
    throw new Error('/api/chat POST did not return a source marker');
  }

  console.log(`OK /api/chat POST -> ${response.status} (${data.source})`);
}

async function expectFastApiHealth(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FastAPI health returned HTTP ${response.status}`);
  }

  const data = await response.json();
  if (typeof data.ok !== 'boolean' || typeof data.ready !== 'boolean') {
    throw new Error('FastAPI health payload is missing readiness fields');
  }

  console.log(`OK ${url} -> ${response.status}`);
}

const rootPath = withPrefix('/');
await waitForBaseUrl(`${baseUrl}${rootPath}`);
await expectHtml(rootPath, 'M&amp;T Immigration', { allowRedirect: true });
await expectHtml(withPrefix('/en/'), 'M&amp;T Immigration', { allowRedirect: true });

if (!staticMode) {
  await expectJson('/api/chat', (data) => {
    if (typeof data.ok !== 'boolean' || typeof data.provider !== 'string') {
      throw new Error('/api/chat readiness payload is invalid');
    }
  });
  await expectChatPost();
  await expectJson('/api/intake', (data) => {
    if (typeof data.ok !== 'boolean' || typeof data.configured !== 'boolean') {
      throw new Error('/api/intake readiness payload is invalid');
    }
  });

  if (fastApiHealthUrl) {
    await expectFastApiHealth(fastApiHealthUrl);
  }
}

console.log('Release smoke checks passed.');
