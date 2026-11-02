import { listOrders } from "@dec-walls/domain/orders";
import { getDevStaffSession, requirePermission } from "@dec-walls/auth";

export default async function OrdersAdminPage() {
  const session = getDevStaffSession();
  requirePermission(session, "orders.read");
  const orders = await listOrders();

  return (
    <div>
      <h1
        className="mb-8"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-body">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between border border-line-soft bg-paper px-4 py-3 text-sm"
            >
              <span>{order.number}</span>
              <span className="text-body">{order.status}</span>
              <span>
                {order.total.currency} {order.total.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
