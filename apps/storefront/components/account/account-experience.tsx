"use client";

import { Eye, EyeOff, Heart, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import styles from "@/components/account/account.module.css";

type Mode = "signin" | "register" | "recover";
type Errors = Partial<Record<"name" | "email" | "password", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const titles: Record<Mode, string> = {
  signin: "Login",
  register: "Create account",
  recover: "Reset your password",
};

export function AccountExperience() {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("signin");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setNotice(null);
    setShowPassword(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: Errors = {};
    if (mode === "register" && name.length < 2) next.name = "Please enter your full name.";
    if (!emailPattern.test(email)) next.email = "Enter a valid email address.";
    if (mode !== "recover" && password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) {
      setNotice(null);
      return;
    }
    // No customer-account backend is connected yet, so be upfront instead of faking a session.
    setNotice(
      mode === "recover"
        ? "Password reset is not available yet. Please contact customer care and we will help you."
        : "Customer accounts are coming soon. You can still shop and check out as a guest.",
    );
  };

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Account</span>
      </nav>

      <div className={styles.layout}>
        <section className={styles.card} aria-labelledby={`${uid}-title`}>
          <h1 id={`${uid}-title`} className={styles.title}>{titles[mode]}</h1>
          {mode === "recover" ? (
            <p className={styles.lead}>Enter your email and we will send you a link to reset your password.</p>
          ) : null}

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {mode === "register" ? (
              <div className={styles.field}>
                <label htmlFor={`${uid}-name`}>Full name</label>
                <input id={`${uid}-name`} name="name" type="text" autoComplete="name" {...field("name")} />
                {errors.name ? <p id={`${uid}-name-error`} className={styles.error} role="alert">{errors.name}</p> : null}
              </div>
            ) : null}

            <div className={styles.field}>
              <label htmlFor={`${uid}-email`}>Email</label>
              <input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" {...field("email")} />
              {errors.email ? <p id={`${uid}-email-error`} className={styles.error} role="alert">{errors.email}</p> : null}
            </div>

            {mode !== "recover" ? (
              <div className={styles.field}>
                <label htmlFor={`${uid}-password`}>Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    id={`${uid}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    {...field("password")}
                  />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password ? <p id={`${uid}-password-error`} className={styles.error} role="alert">{errors.password}</p> : null}
              </div>
            ) : null}

            {mode === "signin" ? (
              <button type="button" className={styles.link} onClick={() => switchMode("recover")}>Forgot your password?</button>
            ) : null}

            <button type="submit" className={styles.submit}>
              {mode === "signin" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
            </button>

            {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
          </form>

          <p className={styles.switch}>
            {mode === "signin" ? (
              <>New customer? <button type="button" onClick={() => switchMode("register")}>Create an account</button></>
            ) : (
              <>{mode === "register" ? "Already have an account?" : "Remembered it?"} <button type="button" onClick={() => switchMode("signin")}>Back to login</button></>
            )}
          </p>
        </section>

        <aside className={styles.aside} aria-label="Account benefits">
          <h2>Why create an account?</h2>
          <ul>
            <li><Package size={20} strokeWidth={1.4} aria-hidden="true" /><span><strong>Track your orders</strong>See delivery status and order history in one place.</span></li>
            <li><Heart size={20} strokeWidth={1.4} aria-hidden="true" /><span><strong>Save your wishlist</strong>Keep the pieces you love for later.</span></li>
            <li><ShoppingBag size={20} strokeWidth={1.4} aria-hidden="true" /><span><strong>Faster checkout</strong>Reuse your details on every order.</span></li>
          </ul>
          <Link href="/wishlist" className={styles.asideLink}>View wishlist</Link>
        </aside>
      </div>
    </div>
  );
}
