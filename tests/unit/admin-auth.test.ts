import { describe, expect, it } from "vitest";
import {
  verifyAdminPassword,
  signAdminToken,
  verifyAdminToken,
  type AdminUser,
} from "../../apps/full-version/src/lib/admin-auth";

const SECRET = "test-secret-32-characters-long!!";
const API_KEY = "test-api-key-abc";

describe("verifyAdminPassword", () => {
  it("returns true when password equals the API key", () => {
    expect(verifyAdminPassword(API_KEY, API_KEY)).toBe(true);
  });

  it("returns false for wrong password", () => {
    expect(verifyAdminPassword("wrong", API_KEY)).toBe(false);
  });

  it("returns false for empty password", () => {
    expect(verifyAdminPassword("", API_KEY)).toBe(false);
  });
});

describe("signAdminToken / verifyAdminToken", () => {
  const user: AdminUser = { id: "1", email: "admin@dec-walls.com", role: "admin" };

  it("round-trips a valid token", () => {
    const token = signAdminToken(user, SECRET);
    const decoded = verifyAdminToken(token, SECRET);
    expect(decoded?.email).toBe(user.email);
    expect(decoded?.role).toBe(user.role);
  });

  it("returns null for a tampered token", () => {
    const token = signAdminToken(user, SECRET) + "X";
    expect(verifyAdminToken(token, SECRET)).toBeNull();
  });

  it("returns null for wrong secret", () => {
    const token = signAdminToken(user, SECRET);
    expect(verifyAdminToken(token, "other-secret")).toBeNull();
  });
});
