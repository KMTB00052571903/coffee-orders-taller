import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

// Mensaje que corresponde a cada código de error recibido en la URL.
const errorMessages: Record<string, string> = {
  item: "El producto es obligatorio y puede tener hasta 80 caracteres.",
  quantity: "La cantidad debe ser un número entero entre 1 y 20.",
  customer: "El ID del cliente debe ser un número entero mayor que 0.",
  notFound: "No existe ningún cliente con ese ID.",
  invalid: "El servidor rechazó los datos. Revisa el formulario.",
  save: "No se pudo crear el pedido. Inténtalo de nuevo.",
};

async function createOrder(formData: FormData) {
  "use server";

  // 1. Leer los campos y convertir los que deben ser números.
  const item = String(formData.get("item") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const customerId = Number(formData.get("customerId"));

  // 2. Validar antes de llamar a la API (mismas reglas que CreateOrderDto).
  if (!item || item.length > 80) redirect("/orders/new?error=item");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    redirect("/orders/new?error=quantity");
  }
  if (!Number.isInteger(customerId) || customerId < 1) {
    redirect("/orders/new?error=customer");
  }

  // 3. Leer el JWT guardado en la cookie al iniciar sesión.
  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  // 4. Enviar el pedido. No se envía status: el backend lo crea como "pending".
  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item, quantity, customerId }),
  }).catch(() => null);

  // 5. Decidir qué hacer según la respuesta.
  if (response?.status === 401) redirect("/login?expired=1");
  if (response?.status === 404) redirect("/orders/new?error=notFound");
  if (response?.status === 400) redirect("/orders/new?error=invalid");
  if (!response?.ok) redirect("/orders/new?error=save");

  // 201 Created: volver al listado.
  redirect("/orders?created=1");
}

type NewOrderPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewOrderPage({ searchParams }: NewOrderPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  // Sin sesión no tiene sentido mostrar el formulario.
  const cookieStore = await cookies();
  if (!cookieStore.has("coffee_token")) redirect("/login");

  return (
    <main>
      <h1>Nuevo pedido</h1>
      <p className="page-intro">El pedido se crea siempre como pendiente.</p>

      {errorMessage && (
        <p className="notice notice-error" role="alert">
          {errorMessage}
        </p>
      )}

      <form action={createOrder} className="form">
        <label>
          Producto
          <input name="item" type="text" maxLength={80} required />
        </label>
        <label>
          Cantidad
          <input
            name="quantity"
            type="number"
            min={1}
            max={20}
            step={1}
            defaultValue={1}
            required
          />
        </label>
        <label>
          ID del cliente
          <input name="customerId" type="number" min={1} step={1} required />
          <span className="hint">Es el ID del cliente que pide, no el de tu usuario.</span>
        </label>
        <div className="actions">
          <button type="submit" className="button">
            Crear pedido
          </button>
          <Link href="/orders">Cancelar</Link>
        </div>
      </form>
    </main>
  );
}
