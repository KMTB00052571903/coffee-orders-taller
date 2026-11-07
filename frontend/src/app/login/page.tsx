import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${process.env.COFFEE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (response?.status === 400 || response?.status === 401) {
    redirect("/login?error=credentials");
  }
  if (!response?.ok) redirect("/login?error=connection");

  const data = await response.json().catch(() => null);
  const token = data?.access_token;
  if (typeof token !== "string" || !token) redirect("/login?error=connection");

  const cookieStore = await cookies();
  cookieStore.set("coffee_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });

  redirect("/orders");
}

type LoginPageProps = {
  searchParams: Promise<{ error?: string; registered?: string; expired?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, registered, expired } = await searchParams;

  return (
    <main>
      <h1>Iniciar sesión</h1>

      {registered === "1" && (
        <p className="notice notice-success">Cuenta creada. Ya puedes iniciar sesión.</p>
      )}
      {expired === "1" && (
        <p className="notice">Tu sesión terminó. Inicia sesión de nuevo.</p>
      )}
      {error === "credentials" && (
        <p className="notice notice-error" role="alert">
          El correo o la contraseña no son correctos.
        </p>
      )}
      {error === "connection" && (
        <p className="notice notice-error" role="alert">
          No se pudo conectar con el servidor. Inténtalo de nuevo.
        </p>
      )}

      <form action={login} className="form">
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit" className="button">
          Entrar
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link href="/register">Crear una cuenta</Link>
      </p>
    </main>
  );
}
