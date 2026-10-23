import {
  clientKeyFromHeaders,
  readLimitedBody,
  withApiHeaders,
} from "@/lib/security";

describe("request guards", () => {
  it("drops injected characters from the client key", () => {
    const headers = new Map<string, string>([
      ["x-forwarded-for", "203.0.113.8 injected, 10.0.0.1"],
    ]);

    expect(
      clientKeyFromHeaders((name) => headers.get(name) ?? null),
    ).toBe("203.0.113.8");
  });

  it("rejects an oversized body even without content-length", async () => {
    const payload = Uint8Array.from("x".repeat(50), (character) =>
      character.charCodeAt(0),
    );
    let sent = false;
    const stream = {
      getReader() {
        return {
          async read() {
            if (sent) {
              return { done: true as const, value: undefined };
            }
            sent = true;
            return { done: false as const, value: payload };
          },
          async cancel() {},
        };
      },
    } as unknown as ReadableStream<Uint8Array>;

    const result = await readLimitedBody(stream, 10);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(413);
    }
  });

  it("adds baseline API security headers", () => {
    const headers = withApiHeaders({ "Cache-Control": "no-store" });
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("cache-control")).toBe("no-store");
  });
});
