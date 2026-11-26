import { describe, it, expect } from "vitest";
import { mapOrderStatus } from "../../apps/storefront/app/api/track/_track-helpers";

describe("mapOrderStatus", () => {
  it("maps pending to step 0", () => {
    expect(mapOrderStatus("pending")).toBe(0);
  });

  it("maps processing to step 1", () => {
    expect(mapOrderStatus("processing")).toBe(1);
  });

  it("maps shipped to step 3", () => {
    expect(mapOrderStatus("shipped")).toBe(3);
  });

  it("maps delivered to step 4", () => {
    expect(mapOrderStatus("delivered")).toBe(4);
  });

  it("maps cancelled to step 0", () => {
    expect(mapOrderStatus("cancelled")).toBe(0);
  });

  it("maps returned to step 0", () => {
    expect(mapOrderStatus("returned")).toBe(0);
  });

  it("maps unknown status to 0", () => {
    expect(mapOrderStatus("unknown")).toBe(0);
  });
});
