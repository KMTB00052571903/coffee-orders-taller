import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El backend tiene su propio package-lock.json en la carpeta superior.
  // Esto le indica a Next.js que la raíz de este proyecto es frontend/.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
