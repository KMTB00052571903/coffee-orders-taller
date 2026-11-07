import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Cada pedido, a su tiempo.</h1>
        <p>Consulta, edita y sigue los pedidos de la cafetería desde un solo lugar.</p>
        <div className="actions">
          <Link href="/orders" className="button">
            Ver pedidos
          </Link>
          <Link href="/summary">Ver resumen</Link>
        </div>
      </section>
    </main>
  );
}
