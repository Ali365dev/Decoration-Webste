import { describe, it, expect } from "vitest";
import { mapOrderStatus, type OrderStatusRow } from "../../apps/storefront/app/api/track/_track-helpers";

describe("mapOrderStatus", () => {
  it("maps pending to step 0", () => {
    expect(mapOrderStatus("pending")).toBe(0);
  });

  it("maps paid to step 1", () => {
    expect(mapOrderStatus("paid")).toBe(1);
  });

  it("maps fulfilled to step 2", () => {
    expect(mapOrderStatus("fulfilled")).toBe(2);
  });

  it("maps unknown status to 0", () => {
    expect(mapOrderStatus("unknown")).toBe(0);
  });
});
