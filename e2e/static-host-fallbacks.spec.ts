import { expect, test } from "@playwright/test";

import { sitePath } from "./paths";

async function advanceIntakeToReview(page: import("@playwright/test").Page) {
  await page.getByLabel("Full Name").fill("Test Visitor");
  await page.getByLabel("Email Address").fill("visitor@example.com");
  await page.getByLabel("Phone").fill("+1 (555) 555-0101");
  await page.getByRole("combobox", { name: "Preferred Language" }).click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("combobox", { name: "Case Type" }).click();
  await page
    .getByRole("option", { name: "Visitor Visa (B1/B2)", exact: true })
    .click();
  await page
    .getByLabel("Brief Summary")
    .fill("I need help understanding the next steps for my visitor visa.");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Review & Submit" }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", { name: /I understand this form is for intake review only/i })
    .check();
}

test("unconfigured payment methods lead to localized contact help", async ({ page }) => {
  await page.goto(sitePath("/en/#payments"));

  await expect(
    page.getByRole("link", { name: "Request card payment link" }),
  ).toHaveAttribute("href", /\/en\/#contact$/);
  await expect(
    page.getByText(
      "Online checkout is unavailable on this site. Contact billing to request a provider-hosted payment link; no payment is collected on this site.",
    ),
  ).toBeVisible();
});

test("an HTML intake error remains readable on a static host", async ({ page }) => {
  await page.route("**/api/intake", (route) =>
    route.fulfill({
      status: 404,
      contentType: "text/html",
      body: "<!doctype html><title>Not found</title>",
    }),
  );
  await page.goto(sitePath("/en/#contact"));
  await advanceIntakeToReview(page);

  await page.getByRole("button", { name: "Submit Request" }).click();

  const alert = page.locator("form [role='alert']");
  await expect(alert).toContainText(
    "This static site cannot accept intake submissions. Please contact the office directly.",
  );
  await expect(alert).not.toContainText("Unexpected token");
  await expect(
    page.getByRole("heading", { name: "Review & Submit" }),
  ).toBeVisible();
  await expect(page.getByText("Test Visitor")).toBeVisible();
});

test("chat provides a local fallback when its API is unavailable", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 404,
      contentType: "text/html",
      body: "<!doctype html><title>Not found</title>",
    }),
  );
  await page.goto(sitePath("/en/"));
  await page.getByRole("button", { name: "Open chat" }).click();
  await page
    .getByLabel("Ask an immigration question")
    .fill("I have an immigration court date.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(
    page.getByText(/facing removal proceedings/i),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "AI is temporarily unavailable. Showing general guidance only.",
  );
});
