import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import IntakeForm from "@/components/features/intake/IntakeForm";

describe("IntakeForm", () => {
  it("shows field errors and stays on the first step when required details are missing", async () => {
    const user = userEvent.setup();
    render(<IntakeForm />);

    await user.type(screen.getByLabelText("Phone"), ".......");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Enter the full name you want us to use.")).toBeVisible();
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    expect(screen.getByText("Enter a phone number we can reach.")).toBeVisible();
    expect(screen.getByText("Choose the language you prefer.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Contact Information" })).toBeVisible();
  });
});
