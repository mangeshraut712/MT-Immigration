import { render, screen } from "@testing-library/react";

import { StatsSection } from "@/components/sections/StatsSection";

describe("StatsSection", () => {
  it("reads the highlight row from translation keys", () => {
    render(<StatsSection />);

    expect(screen.getByText("featureFees")).toBeInTheDocument();
    expect(screen.getByText("featureInterpreter")).toBeInTheDocument();
    expect(screen.getByText("featureUrgent")).toBeInTheDocument();
    expect(screen.queryByText("Transparent consultation fees")).not.toBeInTheDocument();
  });
});
