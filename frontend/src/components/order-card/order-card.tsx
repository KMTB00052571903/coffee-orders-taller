import Link from "next/link";
import type { OrderSummary } from "../../types/order-summary";
import styles from "./order-card.module.css";

type OrderCardProps = {
  order: OrderSummary;
};

export default function OrderCard({ order }: OrderCardProps) {
  const isReady = order.status === "ready";

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.number}>Pedido #{order.id}</span>
        <span className={`${styles.status} ${isReady ? styles.ready : styles.pending}`}>
          {isReady ? "Listo" : "Pendiente"}
        </span>
      </div>
      <h2 className={styles.item}>{order.item}</h2>
      <p className={styles.detail}>Cantidad: {order.quantity}</p>
      {order.customer && <p className={styles.detail}>Cliente: {order.customer.name}</p>}
      <Link href={`/orders/edit?id=${order.id}`} className={styles.edit}>
        Editar pedido
      </Link>
    </article>
  );
}
