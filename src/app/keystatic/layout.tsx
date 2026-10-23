import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isKeystaticEnabled } from "@/server/keystatic";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Panel de administración | MC Diseños",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  if (!isKeystaticEnabled()) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-warm p-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl text-carbon">Panel no disponible</h1>
          <p className="mt-4 text-stone-deep">
            El panel de administración todavía no está configurado en este servidor.
          </p>
        </div>
        {children}
      </main>
    );
  }

  return (
    <>
      <KeystaticApp />
      {/* La página solo aporta el marcador dinámico (no muestra nada). */}
      {children}
    </>
  );
}
