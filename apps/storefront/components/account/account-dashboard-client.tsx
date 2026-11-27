"use client";

import { useActionState, useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@dec-walls/auth/supabase";
import { updateProfile, type ProfileState } from "@/app/(bare)/account/actions";
import type { AccountData } from "@/lib/account-data";
import styles from "./dashboard.module.css";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } finally {
      router.refresh();
      setBusy(false);
    }
  };
  return (
    <button type="button" className={className} onClick={onClick} disabled={busy}>
      {busy ? "Signing out" : "Sign out"}
    </button>
  );
}

const initialProfile: ProfileState = { ok: false, message: null };

export function ProfileForm({ profile }: { profile: AccountData["profile"] }) {
  const uid = useId();
  const [state, action, pending] = useActionState(updateProfile, initialProfile);
  const err = state.errors ?? {};

  return (
    <form className={styles.section} action={action} noValidate>
      <h3 className={styles.sectionTitle}>Your details</h3>
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-name`}>Full name</label>
          <input
            id={`${uid}-name`}
            name="fullName"
            autoComplete="name"
            defaultValue={profile.fullName}
            aria-invalid={err.fullName ? true : undefined}
            aria-describedby={err.fullName ? `${uid}-name-error` : undefined}
          />
          {err.fullName ? <p id={`${uid}-name-error`} className={styles.fieldError} role="alert">{err.fullName}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-phone`}>Phone</label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0300 1234567"
            defaultValue={profile.phone}
            aria-invalid={err.phone ? true : undefined}
            aria-describedby={err.phone ? `${uid}-phone-error` : undefined}
          />
          {err.phone ? <p id={`${uid}-phone-error`} className={styles.fieldError} role="alert">{err.phone}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-email`}>Email</label>
          <input id={`${uid}-email`} type="email" value={profile.email} readOnly aria-describedby={`${uid}-email-hint`} />
          <p id={`${uid}-email-hint`} className={styles.fieldHint}>Used to sign in and for order updates</p>
        </div>
        <div className={styles.formRow}>
          <button type="submit" className={styles.button} disabled={pending}>{pending ? "Saving" : "Save details"}</button>
          {state.message ? <span className={state.ok ? styles.saved : styles.fieldError} role="status">{state.message}</span> : null}
        </div>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const uid = useId();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    setDone(false);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setError(null);
    setPending(true);
    const { error: updateError } = await createSupabaseBrowserClient().auth.updateUser({ password });
    setPending(false);
    if (updateError) return setError(updateError.message);
    form.reset();
    setDone(true);
  };

  return (
    <form className={styles.section} onSubmit={onSubmit} noValidate>
      <h3 className={styles.sectionTitle}>Password</h3>
      <p className={styles.sectionLead}>Choose a new password of at least 8 characters</p>
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-password`}>New password</label>
          <input id={`${uid}-password`} name="password" type="password" autoComplete="new-password" aria-invalid={error ? true : undefined} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-confirm`}>Confirm new password</label>
          <input id={`${uid}-confirm`} name="confirm" type="password" autoComplete="new-password" aria-invalid={error ? true : undefined} />
        </div>
        {error ? <p className={styles.fieldError} role="alert">{error}</p> : null}
        <div className={styles.formRow}>
          <button type="submit" className={styles.button} disabled={pending}>{pending ? "Updating" : "Update password"}</button>
          {done ? <span className={styles.saved} role="status">Password updated</span> : null}
        </div>
      </div>
    </form>
  );
}
