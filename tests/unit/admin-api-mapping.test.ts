import { describe, expect, it } from "vitest";
import {
  mapOrderRow,
  mapCustomerRow,
  mapVariantRow,
} from "../../apps/storefront/app/api/admin/_mappers";

describe("mapOrderRow", () => {
  it("maps a DB order row to the dashboard shape", () => {
    const row = {
      id: "o1",
      number: "DW-10001",
      status: "pending" as const,
      total: 3500,
      createdAt: new Date("2026-01-01"),
      customerEmail: "test@example.com",
      customerName: "Ahmed Ali",
    };
    const mapped = mapOrderRow(row);
    expect(mapped.id).toBe("o1");
    expect(mapped.orderNumber).toBe("DW-10001");
    expect(mapped.status).toBe("pending");
    expect(mapped.total).toBe(3500);
    expect(mapped.customer.email).toBe("test@example.com");
  });

  it("handles null customer info gracefully", () => {
    const row = {
      id: "o2",
      number: "DW-10002",
      status: "pending" as const,
      total: 1200,
      createdAt: new Date(),
      customerEmail: null,
      customerName: null,
    };
    const mapped = mapOrderRow(row);
    expect(mapped.customer.email).toBe("");
    expect(mapped.customer.name).toBe("Guest");
  });
});

describe("mapCustomerRow", () => {
  it("maps a DB customer row to the dashboard shape", () => {
    const row = {
      id: "c1",
      email: "sara@example.com",
      fullName: "Sara Khan",
      phone: "+923001234567",
      city: "Lahore",
      createdAt: new Date("2026-01-15"),
      orderCount: 3,
      totalSpent: 15000,
    };
    const mapped = mapCustomerRow(row);
    expect(mapped.id).toBe("c1");
    expect(mapped.email).toBe("sara@example.com");
    expect(mapped.fullName).toBe("Sara Khan");
    expect(mapped.orderCount).toBe(3);
    expect(mapped.totalSpent).toBe(15000);
  });
});

describe("mapVariantRow", () => {
  it("maps a DB variant row for inventory display", () => {
    const row = {
      id: "v1",
      productId: "p1",
      sku: "PROD-DEFAULT",
      inventoryQuantity: 10,
      price: 2500,
      productName: "Canvas Wall Art",
      productSlug: "canvas-wall-art",
      productStatus: "published" as const,
    };
    const mapped = mapVariantRow(row);
    expect(mapped.id).toBe("v1");
    expect(mapped.sku).toBe("PROD-DEFAULT");
    expect(mapped.stock).toBe(10);
    expect(mapped.productName).toBe("Canvas Wall Art");
    expect(mapped.price).toBe(2500);
  });
});
