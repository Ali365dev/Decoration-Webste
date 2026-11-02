import { listProducts } from "@dec-walls/domain/catalog";
import { listOrders } from "@dec-walls/domain/orders";
import { listPagesAdmin } from "@dec-walls/domain/cms";

export default async function DashboardPage() {
  const [products, orders, pages] = await Promise.all([
    listProducts({ page: 1, pageSize: 100 }),
    listOrders(),
    listPagesAdmin(),
  ]);

  const stats = [
    { label: "Products", value: products.total },
    { label: "Orders", value: orders.length },
    { label: "CMS pages", value: pages.length },
  ];

  return (
    <div>
      <h1
        className="mb-8"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-line-soft bg-paper p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-body">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-medium text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
