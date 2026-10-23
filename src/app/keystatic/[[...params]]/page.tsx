import { Suspense } from "react";
import { connection } from "next/server";

/**
 * El panel se dibuja en el layout; esta página solo habilita todas las rutas de
 * /keystatic. El marcador dinámico indica a Next.js (Cache Components) que el
 * panel se resuelve en cada solicitud y nunca se guarda como página estática.
 */
async function DynamicMarker() {
  await connection();
  return null;
}

export default function KeystaticPage() {
  return (
    <Suspense>
      <DynamicMarker />
    </Suspense>
  );
}
