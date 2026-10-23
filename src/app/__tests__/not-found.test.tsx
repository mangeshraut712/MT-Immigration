import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("links back to localized routes", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/en\/?$/),
    );
    expect(screen.getByRole("link", { name: /open insights/i })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/en\/insights\/?$/),
    );
  });
});
