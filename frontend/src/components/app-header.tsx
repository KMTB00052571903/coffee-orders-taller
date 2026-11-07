import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("coffee_token");
  redirect("/login");
}

export default async function AppHeader() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("coffee_token");

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Coffee Orders
      </Link>
      <nav className="site-nav" aria-label="Navegación principal">
        <Link href="/orders">Pedidos</Link>
        <Link href="/summary">Resumen</Link>
        {hasSession ? (
          <form action={logout}>
            <button type="submit" className="link-button">
              Cerrar sesión
            </button>
          </form>
        ) : (
          <>
            <Link href="/login">Iniciar sesión</Link>
            <Link href="/register">Crear cuenta</Link>
          </>
        )}
      </nav>
    </header>
  );
}
