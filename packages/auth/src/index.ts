import type { Permission, StaffRole } from "@dec-walls/types";
import { roleHasPermission } from "./permissions";

export class AuthError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHENTICATED" | "FORBIDDEN" = "UNAUTHENTICATED",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export type StaffSession = {
  kind: "staff";
  authUserId: string;
  email: string;
  role: StaffRole;
  staffUserId: string;
};

export type CustomerSession = {
  kind: "customer";
  authUserId: string;
  email: string;
  customerId: string | null;
};

export type AppSession = StaffSession | CustomerSession;

/** In-memory / stub session for local development without Supabase. */
const stubStaff: StaffSession = {
  kind: "staff",
  authUserId: "00000000-0000-4000-8000-000000000001",
  email: "admin@decwalls.local",
  role: "super_admin",
  staffUserId: "00000000-0000-4000-8000-000000000002",
};

export function getDevStaffSession(): StaffSession {
  return stubStaff;
}

export function requirePermission(
  session: StaffSession | null | undefined,
  permission: Permission,
): StaffSession {
  if (!session) {
    throw new AuthError("Authentication required", "UNAUTHENTICATED");
  }
  if (!roleHasPermission(session.role, permission)) {
    throw new AuthError(`Missing permission: ${permission}`, "FORBIDDEN");
  }
  return session;
}

export function requireStaff(
  session: AppSession | null | undefined,
): StaffSession {
  if (!session || session.kind !== "staff") {
    throw new AuthError("Staff authentication required", "UNAUTHENTICATED");
  }
  return session;
}

export function requireCustomer(
  session: AppSession | null | undefined,
): CustomerSession {
  if (!session || session.kind !== "customer") {
    throw new AuthError("Customer authentication required", "UNAUTHENTICATED");
  }
  return session;
}

export * from "./permissions";
export * from "./supabase";
