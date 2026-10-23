describe("public contact links", () => {
  const originalHref = process.env.NEXT_PUBLIC_FIRM_PHONE_HREF;
  const originalEmailHref = process.env.NEXT_PUBLIC_FIRM_EMAIL_HREF;

  afterEach(() => {
    process.env.NEXT_PUBLIC_FIRM_PHONE_HREF = originalHref;
    process.env.NEXT_PUBLIC_FIRM_EMAIL_HREF = originalEmailHref;
    jest.resetModules();
  });

  it("ignores javascript contact hrefs", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_FIRM_PHONE_HREF = "javascript:alert(1)";
    process.env.NEXT_PUBLIC_FIRM_PHONE_DISPLAY = "(555) 123-4567";
    process.env.NEXT_PUBLIC_FIRM_EMAIL_HREF = "javascript:alert(1)";
    process.env.NEXT_PUBLIC_FIRM_EMAIL = "help@mtimmigration.com";

    const { firmConfig } = await import("@/config/firm");

    expect(firmConfig.contact.phoneHref).toBe("tel:5551234567");
    expect(firmConfig.contact.emailHref).toBe("mailto:help@mtimmigration.com");
  });
});

describe("canonical urls", () => {
  it("uses the default locale and a trailing slash", async () => {
    const { buildCanonicalUrl, getLanguageAlternates } = await import(
      "@/config/site"
    );

    expect(buildCanonicalUrl("/en/insights")).toMatch(/\/en\/insights\/$/);
    expect(getLanguageAlternates("/insights").canonical).toMatch(/\/en\/insights\/$/);
    expect(buildCanonicalUrl("/openapi.json")).toMatch(/\/openapi\.json$/);
  });
});
