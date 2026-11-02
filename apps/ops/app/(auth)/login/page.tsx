import { Button, Input } from "@dec-walls/ui";

export default function OpsLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <h1 className="mb-6 text-3xl font-medium">Staff sign in</h1>
      <form className="space-y-4">
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Password" />
        <Button variant="primary" type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-4 text-sm text-body">
        Uses Supabase Auth for staff. Locally, domain APIs use the dev staff
        session when credentials are absent.
      </p>
    </div>
  );
}
