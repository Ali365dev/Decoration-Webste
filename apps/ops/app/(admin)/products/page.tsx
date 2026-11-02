import { listAllProductsAdmin } from "@dec-walls/domain/catalog";
import { getDevStaffSession, requirePermission } from "@dec-walls/auth";
import Link from "next/link";

export default async function ProductsAdminPage() {
  const session = getDevStaffSession();
  requirePermission(session, "products.read");
  const products = await listAllProductsAdmin();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1
          style={{
            fontSize: "var(--page-title-size)",
            fontWeight: "var(--heading-font-weight)",
          }}
        >
          Products
        </h1>
        <Link
          href="/products/new"
          className="rounded-pill bg-ink px-6 py-3 text-xs font-medium uppercase text-white"
        >
          New product
        </Link>
      </div>
      <div className="overflow-x-auto border border-line-soft bg-paper">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line-soft text-xs uppercase tracking-wide text-body">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line-soft">
                <td className="px-4 py-3 text-ink">{product.name}</td>
                <td className="px-4 py-3 text-body">{product.slug}</td>
                <td className="px-4 py-3 text-body">{product.status}</td>
                <td className="px-4 py-3 text-body">
                  {product.price.currency} {product.price.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
