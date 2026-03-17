import process from 'node:process';

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';
const baseUrl = (process.argv[2] || process.env.SMOKE_BASE_URL || DEFAULT_BASE_URL).replace(
  /\/$/,
  '',
);
const fastApiHealthUrl = process.env.SMOKE_FASTAPI_HEALTH_URL?.trim() || '';
const waitTimeoutMs = 20_000;

async function waitForBaseUrl(url) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < waitTimeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function expectHtml(pathname, expectedText) {
  const response = await fetch(`${baseUrl}${pathname}`);
  if (!response.ok) {
    throw new Error(`${pathname} returned HTTP ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes(expectedText)) {
    throw new Error(`${pathname} did not include expected text: ${expectedText}`);
  }

  console.log(`OK ${pathname} -> ${response.status}`);
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

await waitForBaseUrl(baseUrl);
await expectHtml('/', 'M&amp;T Immigration');
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

console.log('Release smoke checks passed.');
