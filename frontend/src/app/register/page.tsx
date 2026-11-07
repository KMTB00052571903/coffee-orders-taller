import Link from "next/link";
import { redirect } from "next/navigation";

// Mensaje que corresponde a cada código de error recibido en la URL.
const errorMessages: Record<string, string> = {
  email: "Escribe un correo válido.",
  length: "La contraseña debe tener entre 8 y 15 caracteres.",
  format: "La contraseña solo puede tener letras sin acentos, números, espacios, - y _.",
  mismatch: "Las contraseñas no coinciden.",
  duplicate: "Ese correo ya está registrado. Inicia sesión o usa otro correo.",
  invalid: "El servidor rechazó los datos. Revisa el correo y la contraseña.",
  connection: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
};

async function register(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email.includes("@") || email.length > 150) redirect("/register?error=email");
  if (password.length < 8 || password.length > 15) redirect("/register?error=length");
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(password)) redirect("/register?error=format");
  if (password !== confirmPassword) redirect("/register?error=mismatch");

  // confirmPassword se queda aquí: la API rechaza cualquier campo que no conozca.
  const response = await fetch(`${process.env.COFFEE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (response?.status === 409) redirect("/register?error=duplicate");
  if (response?.status === 400) redirect("/register?error=invalid");
  if (!response?.ok) redirect("/register?error=connection");

  // Registrarse no devuelve un token, así que no se guarda ninguna cookie.
  redirect("/login?registered=1");
}

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main>
      <h1>Crear cuenta</h1>

      {errorMessage && (
        <p className="notice notice-error" role="alert">
          {errorMessage}
        </p>
      )}

      <form action={register} className="form">
        <label>
          Correo
          <input name="email" type="email" maxLength={150} autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            minLength={8}
            maxLength={15}
            autoComplete="new-password"
            required
          />
          <span className="hint">
            De 8 a 15 caracteres: letras sin acentos, números, espacios, - y _.
          </span>
        </label>
        <label>
          Repetir contraseña
          <input
            name="confirmPassword"
            type="password"
            minLength={8}
            maxLength={15}
            autoComplete="new-password"
            required
          />
        </label>
        <button type="submit" className="button">
          Crear cuenta
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}
