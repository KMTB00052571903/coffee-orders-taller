import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppHeader from "../components/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Orders",
  description: "Consulta y edición de los pedidos de la cafetería.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
