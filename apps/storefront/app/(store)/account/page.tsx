import Link from "next/link";

export default function AccountPage() {
  return (
    <section className="container-page py-16">
      <h1
        className="mb-4 text-ink"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        Account
      </h1>
      <p className="mb-6 text-body">
        Customer authentication is provided by Supabase Auth once credentials are
        configured.
      </p>
      <Link href="/" className="text-sm text-ink underline">
        Continue shopping
      </Link>
    </section>
  );
}
