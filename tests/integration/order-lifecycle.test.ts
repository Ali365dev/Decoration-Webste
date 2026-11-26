import { describe, it, expect } from "vitest";
import { mapOrderStatus } from "../../apps/storefront/app/api/track/_track-helpers";

// DB order status enum: pending | processing | shipped | delivered | cancelled | returned

describe("order status lifecycle", () => {
  it("maps the full fulfillment progression to increasing steps", () => {
    const steps = ["pending", "processing", "shipped", "delivered"].map(mapOrderStatus);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1]!);
    }
  });

  it("cancelled and returned both show as step 0 (order placed)", () => {
    expect(mapOrderStatus("cancelled")).toBe(0);
    expect(mapOrderStatus("returned")).toBe(0);
  });

  it("delivered is the final step (4)", () => {
    expect(mapOrderStatus("delivered")).toBe(4);
  });

  it("shipped is one step before delivered", () => {
    expect(mapOrderStatus("shipped")).toBe(mapOrderStatus("delivered") - 1);
  });
});
