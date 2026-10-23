import { intakeSchema } from "@/server/schemas/intake";

const validIntake = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+1 (555) 123-4567",
  language: "English",
  caseType: "Visitor Visa",
  summary: "I need help understanding a visitor visa deadline and the next filing step.",
  hasPassport: true,
  hasReceipts: false,
  consent: true,
  website: "",
};

describe("intakeSchema", () => {
  it("accepts a complete intake submission", () => {
    expect(intakeSchema.safeParse(validIntake).success).toBe(true);
  });

  it("rejects phone numbers that do not contain enough digits", () => {
    const parsed = intakeSchema.safeParse({
      ...validIntake,
      phone: ".......",
    });

    expect(parsed.success).toBe(false);
  });

  it("preserves a filled honeypot instead of failing validation", () => {
    const parsed = intakeSchema.safeParse({
      ...validIntake,
      website: "https://spam.example",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.website).toBe("https://spam.example");
    }
  });

  it("requires consent", () => {
    expect(
      intakeSchema.safeParse({ ...validIntake, consent: false }).success,
    ).toBe(false);
  });
});
