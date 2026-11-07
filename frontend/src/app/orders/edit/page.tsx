import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { OrderSummary } from "../../../types/order-summary";

// Mensaje que corresponde a cada código de error recibido en la URL.
const errorMessages: Record<string, string> = {
  item: "El producto es obligatorio y puede tener hasta 80 caracteres.",
  quantity: "La cantidad debe ser un número entero entre 1 y 20.",
  status: "Elige un estado válido.",
  save: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
};

async function updateOrder(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const item = String(formData.get("item") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const status = formData.get("status");

  if (!Number.isInteger(id) || id < 1) redirect("/orders");

  const editPage = `/orders/edit?id=${id}`;
  if (!item || item.length > 80) redirect(`${editPage}&error=item`);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    redirect(`${editPage}&error=quantity`);
  }
  if (status !== "pending" && status !== "ready") redirect(`${editPage}&error=status`);

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  // Solo se envían los tres campos editables; quantity ya es un número.
  const response = await fetch(`${process.env.COFFEE_API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item, quantity, status }),
  }).catch(() => null);

  if (response?.status === 401) redirect("/login?expired=1");
  if (!response?.ok) redirect(`${editPage}&error=save`);

  // /orders usa cache: "no-store", así que muestra los datos ya actualizados.
  redirect("/orders?updated=1");
}

type EditOrderPageProps = {
  searchParams: Promise<{ id?: string; error?: string }>;
};

export default async function EditOrderPage({ searchParams }: EditOrderPageProps) {
  const { id, error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const orderId = Number(id);
  const isValidId = Number.isInteger(orderId) && orderId > 0;

  const response = isValidId
    ? await fetch(`${process.env.COFFEE_API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).catch(() => null)
    : null;

  if (response?.status === 401) redirect("/login?expired=1");

  const order: OrderSummary | null = response?.ok
    ? await response.json().catch(() => null)
    : null;

  if (!order) {
    const notFound = !isValidId || response?.status === 404;

    return (
      <main>
        <h1>Editar pedido</h1>
        <p className="notice notice-error" role="alert">
          {notFound
            ? "Ese pedido no existe."
            : "No se pudo consultar el pedido. Inténtalo de nuevo."}
        </p>
        <Link href="/orders">Volver a pedidos</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Editar pedido #{order.id}</h1>
      {order.customer && <p className="page-intro">Cliente: {order.customer.name}</p>}

      {errorMessage && (
        <p className="notice notice-error" role="alert">
          {errorMessage}
        </p>
      )}

      <form action={updateOrder} className="form">
        <input type="hidden" name="id" value={order.id} />
        <label>
          Producto
          <input name="item" type="text" defaultValue={order.item} maxLength={80} required />
        </label>
        <label>
          Cantidad
          <input
            name="quantity"
            type="number"
            defaultValue={order.quantity}
            min={1}
            max={20}
            step={1}
            required
          />
        </label>
        <label>
          Estado
          <select name="status" defaultValue={order.status}>
            <option value="pending">Pendiente</option>
            <option value="ready">Listo</option>
          </select>
        </label>
        <div className="actions">
          <button type="submit" className="button">
            Guardar cambios
          </button>
          <Link href="/orders">Cancelar</Link>
        </div>
      </form>
    </main>
  );
}
