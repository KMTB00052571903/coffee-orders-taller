import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrdersSummary from "../../components/orders-summary/orders-summary";
import type { OrderSummary } from "../../types/order-summary";
import styles from "./summary.module.css";

export default async function SummaryPage() {
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

  const total = orders ? orders.length : 0;
  const pending = orders ? orders.filter((order) => order.status === "pending").length : 0;
  const ready = orders ? orders.filter((order) => order.status === "ready").length : 0;
  const otherStatuses = total - pending - ready;
  const readyPercent = total > 0 ? Math.round((ready / total) * 100) : 0;

  return (
    <main>
      <h1>Resumen de pedidos</h1>
      <p className="page-intro">Calculado a partir de los pedidos actuales de la cafetería.</p>

      {orders === null && (
        <p className="notice notice-error" role="alert">
          No se pudo consultar el resumen. Inténtalo de nuevo.
        </p>
      )}
      {orders?.length === 0 && <p className="notice">Todavía no hay pedidos.</p>}

      {orders && orders.length > 0 && (
        <>
          <OrdersSummary total={total} pending={pending} ready={ready} />

          <section className={styles.progress} aria-label="Avance de los pedidos">
            <p>{readyPercent}% de los pedidos están listos</p>
            <div className={styles.track}>
              <div className={styles.bar} style={{ width: `${readyPercent}%` }} />
            </div>
          </section>

          {otherStatuses > 0 && (
            <p className="notice">Pedidos con otro estado: {otherStatuses}</p>
          )}

          <Link href="/orders">Ver todos los pedidos</Link>
        </>
      )}
    </main>
  );
}
