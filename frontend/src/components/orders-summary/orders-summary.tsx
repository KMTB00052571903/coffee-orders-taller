import styles from "./orders-summary.module.css";

type OrdersSummaryProps = {
  total: number;
  pending: number;
  ready: number;
};

export default function OrdersSummary({ total, pending, ready }: OrdersSummaryProps) {
  return (
    <dl className={styles.summary}>
      <div className={styles.tile}>
        <dt>Total</dt>
        <dd>{total}</dd>
      </div>
      <div className={`${styles.tile} ${styles.pending}`}>
        <dt>Pendientes</dt>
        <dd>{pending}</dd>
      </div>
      <div className={`${styles.tile} ${styles.ready}`}>
        <dt>Listos</dt>
        <dd>{ready}</dd>
      </div>
    </dl>
  );
}
