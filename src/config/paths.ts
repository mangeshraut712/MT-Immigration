const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

export const SITE_BASE_PATH = configuredBasePath.replace(/\/+$/, "");

export function joinSiteUrl(base: string, path = "/"): string {
  const trimmedBase = base.replace(/\/+$/, "");
  if (!path || path === "/") {
    return `${trimmedBase}/`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  if (!SITE_BASE_PATH) {
    return path;
  }

  if (path === SITE_BASE_PATH || path.startsWith(`${SITE_BASE_PATH}/`)) {
    return path;
  }

  return `${SITE_BASE_PATH}${path}`;
}
