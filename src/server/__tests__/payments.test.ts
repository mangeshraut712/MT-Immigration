describe("resolvePaymentRedirect", () => {
  const originalStripe = process.env.STRIPE_CHECKOUT_URL;
  const originalWire = process.env.WIRE_TRANSFER_REQUEST_URL;

  afterEach(() => {
    process.env.STRIPE_CHECKOUT_URL = originalStripe;
    process.env.WIRE_TRANSFER_REQUEST_URL = originalWire;
    jest.resetModules();
  });

  async function resolve(method: "stripe-cards" | "wire-transfer") {
    jest.resetModules();
    const { resolvePaymentRedirect } = await import("@/server/payments");
    return resolvePaymentRedirect(method);
  }

  it("allows an https payment host on the allowlist", async () => {
    process.env.STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_session";
    await expect(resolve("stripe-cards")).resolves.toBe(
      "https://buy.stripe.com/test_session",
    );
  });

  it("rejects credentialed, loopback, and off-allowlist destinations", async () => {
    process.env.STRIPE_CHECKOUT_URL = "https://user:pass@buy.stripe.com/test";
    await expect(resolve("stripe-cards")).resolves.toBeNull();

    process.env.STRIPE_CHECKOUT_URL = "https://evil.example/checkout";
    await expect(resolve("stripe-cards")).resolves.toBeNull();

    process.env.WIRE_TRANSFER_REQUEST_URL = "https://127.0.0.1/wire";
    await expect(resolve("wire-transfer")).resolves.toBeNull();
  });
});
