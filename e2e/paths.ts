const prefix = (process.env.PLAYWRIGHT_PATH_PREFIX ?? "").replace(/\/$/, "");

export function sitePath(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${prefix}${normalized}`;
}
