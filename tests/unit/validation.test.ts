import { describe, expect, it } from "vitest";
import {
  addressSchema,
  contactMessageSchema,
  newsletterSchema,
  sizeSkuSchema,
  couponCodeSchema,
  phoneSchema,
} from "../../packages/validation/src/index";

describe("addressSchema", () => {
  it("accepts a valid Pakistani address", () => {
    const result = addressSchema.safeParse({
      fullName: "Ahmed Ali",
      line1: "House 5, Street 3",
      city: "Lahore",
      country: "PK",
      phone: "+923001234567",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when fullName is missing", () => {
    const result = addressSchema.safeParse({
      line1: "House 5",
      city: "Lahore",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when city is missing", () => {
    const result = addressSchema.safeParse({
      fullName: "Ahmed Ali",
      line1: "House 5",
    });
    expect(result.success).toBe(false);
  });

  it("defaults country to PK", () => {
    const result = addressSchema.safeParse({
      fullName: "Ahmed Ali",
      line1: "House 5",
      city: "Lahore",
    });
    expect(result.success && result.data.country).toBe("PK");
  });
});

describe("contactMessageSchema", () => {
  it("accepts a valid contact message", () => {
    const result = contactMessageSchema.safeParse({
      name: "Sara",
      email: "sara@example.com",
      subject: "Order inquiry",
      message: "When will my order arrive?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactMessageSchema.safeParse({
      name: "Sara",
      email: "not-an-email",
      subject: "Hi",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message shorter than 10 characters", () => {
    const result = contactMessageSchema.safeParse({
      name: "Sara",
      email: "sara@example.com",
      subject: "Hi",
      message: "Short",
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    const result = newsletterSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "not-valid" });
    expect(result.success).toBe(false);
  });
});

describe("sizeSkuSchema", () => {
  it("accepts a valid SKU with size suffix", () => {
    expect(sizeSkuSchema.safeParse("KHAISE-SGL").success).toBe(true);
    expect(sizeSkuSchema.safeParse("BED-KNG").success).toBe(true);
  });

  it("rejects SKU with lowercase", () => {
    expect(sizeSkuSchema.safeParse("khaise-sgl").success).toBe(false);
  });

  it("rejects empty SKU", () => {
    expect(sizeSkuSchema.safeParse("").success).toBe(false);
  });
});

describe("couponCodeSchema", () => {
  it("accepts uppercase alphanumeric codes", () => {
    expect(couponCodeSchema.safeParse("SAVE10").success).toBe(true);
    expect(couponCodeSchema.safeParse("WINTER2026").success).toBe(true);
  });

  it("rejects codes with spaces", () => {
    expect(couponCodeSchema.safeParse("SAVE 10").success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(couponCodeSchema.safeParse("").success).toBe(false);
  });

  it("rejects code longer than 32 characters", () => {
    expect(couponCodeSchema.safeParse("A".repeat(33)).success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("accepts Pakistani mobile number formats", () => {
    expect(phoneSchema.safeParse("+923001234567").success).toBe(true);
    expect(phoneSchema.safeParse("03001234567").success).toBe(true);
  });

  it("rejects obviously invalid phone", () => {
    expect(phoneSchema.safeParse("123").success).toBe(false);
  });
});
