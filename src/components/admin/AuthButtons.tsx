"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.96 2.3-2.04 3.01l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.72-.06-1.41-.18-2.08H12z" />
      <path fill="#34A853" d="M6.56 14.28l-.74.57-2.63 2.05A9.98 9.98 0 0 0 12 22c2.7 0 4.96-.89 6.61-2.42l-3.3-2.56c-.9.6-2.06.97-3.31.97-2.6 0-4.81-1.76-5.6-4.12z" />
      <path fill="#4A90E2" d="M3.19 7.1A9.9 9.9 0 0 0 2 12c0 1.62.39 3.15 1.19 4.9l3.37-2.62A6 6 0 0 1 6.25 12c0-.79.14-1.55.31-2.28z" />
      <path fill="#FBBC05" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86C16.95 2.99 14.7 2 12 2 8.1 2 4.73 4.24 3.19 7.1l3.37 2.62C7.19 7.74 9.4 5.98 12 5.98z" />
    </svg>
  );
}

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        void signIn("google", { callbackUrl: "/admin" });
      }}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-carbon/20 bg-white px-6 text-sm font-semibold text-carbon transition-colors hover:border-carbon disabled:opacity-60"
    >
      <GoogleIcon />
      {loading ? "Abriendo Google…" : "Iniciar sesión con Google"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className={buttonClasses("outline", "min-h-10 px-4")}
    >
      <LogOut className="size-4" aria-hidden="true" />
      Cerrar sesión
    </button>
  );
}
