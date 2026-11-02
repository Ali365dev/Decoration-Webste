export default function UsersPage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-medium">Users & roles</h1>
      <p className="text-body">
        Staff users are authorized with RBAC permissions enforced in{" "}
        <code>@dec-walls/auth</code>.
      </p>
    </div>
  );
}
