import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrderCard from "../../components/order-card/order-card";
import OrdersSummary from "../../components/orders-summary/orders-summary";
import type { OrderSummary } from "../../types/order-summary";

type OrdersPageProps = {
  searchParams: Promise<{ updated?: string; created?: string }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { updated, created } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login?expired=1");

  const data = response?.ok ? await response.json().catch(() => null) : null;
  const orders: OrderSummary[] | null = Array.isArray(data) ? data : null;

  return (
    <main>
      <h1>Pedidos</h1>
      <div className="actions">
        <Link href="/orders/new" className="button">
          Nuevo pedido
        </Link>
      </div>

      {created === "1" && (
        <p className="notice notice-success">Pedido creado correctamente.</p>
      )}
      {updated === "1" && (
        <p className="notice notice-success">Pedido actualizado correctamente.</p>
      )}
      {orders === null && (
        <p className="notice notice-error" role="alert">
          No se pudieron consultar los pedidos. Inténtalo de nuevo.
        </p>
      )}
      {orders?.length === 0 && <p className="notice">Todavía no hay pedidos.</p>}

      {orders && orders.length > 0 && (
        <>
          <OrdersSummary
            total={orders.length}
            pending={orders.filter((order) => order.status === "pending").length}
            ready={orders.filter((order) => order.status === "ready").length}
          />
          <section className="orders-grid" aria-label="Listado de pedidos">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
