import { fireEvent, render, screen } from "@testing-library/react";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const mockPush = jest.fn();
let mockPathname = "/";
let mockSearch = "";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

function renderAndOpenMenu() {
  render(<LanguageSwitcher currentLocale="en" />);
  fireEvent.click(screen.getByRole("button", { name: /change language/i }));
  return screen.getAllByRole("menuitem");
}

function findLocaleItem(items: HTMLElement[], name: string) {
  const item = items.find((candidate) => candidate.textContent?.includes(name));
  if (!item) {
    throw new Error(`Locale menu item not found: ${name}`);
  }
  return item;
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPathname = "/";
    mockSearch = "";
    window.history.replaceState(null, "", "/");
  });

  it("preserves the current path, query string, and hash when switching locale", () => {
    mockPathname = "/insights";
    mockSearch = "view=news";
    window.history.replaceState(null, "", "/insights?view=news#faq");

    const items = renderAndOpenMenu();
    fireEvent.click(findLocaleItem(items, "Español"));

    expect(mockPush).toHaveBeenCalledWith("/es/insights?view=news#faq");
  });

  it("builds the bare locale URL for the homepage without query or hash", () => {
    const items = renderAndOpenMenu();
    fireEvent.click(findLocaleItem(items, "Español"));

    expect(mockPush).toHaveBeenCalledWith("/es");
  });

  it("wraps arrow-key navigation and closes on Escape restoring trigger focus", () => {
    const items = renderAndOpenMenu();
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[items.length - 1]);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0]);

    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /change language/i }),
    );
  });
});
