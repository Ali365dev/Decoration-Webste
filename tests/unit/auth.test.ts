import { describe, expect, it } from "vitest";
import {
  getDevStaffSession,
  requirePermission,
  AuthError,
  roleHasPermission,
} from "../../packages/auth/src";

describe("auth rbac", () => {
  it("grants super_admin products.write", () => {
    expect(roleHasPermission("super_admin", "products.write")).toBe(true);
  });

  it("denies support products.write", () => {
    expect(roleHasPermission("support", "products.write")).toBe(false);
  });

  it("requirePermission throws when missing", () => {
    const session = {
      ...getDevStaffSession(),
      role: "support" as const,
    };
    expect(() => requirePermission(session, "cms.publish")).toThrow(AuthError);
  });
});
