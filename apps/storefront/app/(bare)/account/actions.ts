"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { getDb } from "@dec-walls/db/client";
import { withCustomer } from "@dec-walls/db/with-customer";
import { customers } from "@dec-walls/db/schema";
import { getSignedInUser } from "@/lib/customer-session";

export type ProfileState = { ok: boolean; message: string | null; errors?: { fullName?: string; phone?: string } };

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || /^[+\d][\d\s-]{6,18}$/.test(v), "Enter a valid phone number."),
});

export async function updateProfile(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await getSignedInUser();
  if (!user) return { ok: false, message: "Your session has ended. Please sign in again." };
  const db = getDb();
  if (!db) return { ok: false, message: "Account service is not available right now." };

  const parsed = profileSchema.safeParse({ fullName: form.get("fullName") ?? "", phone: form.get("phone") ?? "" });
  if (!parsed.success) {
    const errors: ProfileState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "fullName" || key === "phone") errors[key] ??= issue.message;
    }
    return { ok: false, message: null, errors };
  }

  // Runs under row level security: the update can only touch this customer's own row.
  await withCustomer(db, user.id, (tx) =>
    tx
      .update(customers)
      .set({ fullName: parsed.data.fullName, phone: parsed.data.phone || null })
      .where(eq(customers.authUserId, user.id)),
  );
  revalidatePath("/account");
  return { ok: true, message: "Profile saved" };
}
