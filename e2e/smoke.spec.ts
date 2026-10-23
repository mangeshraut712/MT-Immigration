import { expect, test } from "@playwright/test";

import { sitePath } from "./paths";

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto(sitePath("/en/"));
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("home page publishes a localized canonical url", async ({ page }) => {
  await page.goto(sitePath("/en/"));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/$/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("arabic pages use a right-to-left document", async ({ page }) => {
  await page.goto(sitePath("/ar/"));
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("intake validation stays on the contact step", async ({ page }) => {
  await page.goto(sitePath("/en/#contact"));
  await page.getByLabel("Phone").fill(".......");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter a phone number we can reach.")).toBeVisible();
  await expect(
    page.locator("form").getByRole("heading", { name: "Contact Information" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Case Details" }),
  ).toHaveCount(0);
});

test("language menu supports escape", async ({ page }) => {
  await page.goto(sitePath("/en/"));
  await page.getByRole("button", { name: /Current language/ }).click();
  const menu = page.getByRole("menu", { name: "Select Language" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
});

test("mobile navigation opens and closes from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(sitePath("/en/"));
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toBeFocused();
});

test("an insight article exposes a working share control", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto(
    sitePath(
      "/en/insights/eoir-shifted-immigration-filing-fee-payments-to-electronic-processing-only/",
    ),
  );
  await expect(page.getByRole("heading", { name: "What changed" })).toBeVisible();
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByRole("status")).toContainText(/copied|not available/i);
});
