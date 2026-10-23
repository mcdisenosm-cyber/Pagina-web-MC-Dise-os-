"use client";

import { useActionState, useId, useState } from "react";
import { CircleAlert, Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/button";

const fieldClass =
  "mt-2 block w-full border border-carbon/20 bg-white px-3 py-2.5 text-base text-carbon focus:border-carbon focus:outline-none focus:ring-1 focus:ring-carbon";

export function LoginForm() {
  const uid = useId();
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      {state.error ? (
        <p role="alert" className="flex items-start gap-2 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-900">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor={`${uid}-email`} className="text-sm font-semibold text-carbon">
          Correo
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={200}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-password`} className="text-sm font-semibold text-carbon">
          Contraseña
        </label>
        <div className="relative">
          <input
            id={`${uid}-password`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={200}
            className={`${fieldClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-1 mt-1 flex size-10 -translate-y-1/2 items-center justify-center text-stone-deep hover:text-carbon"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={pending} className={buttonClasses("solid", "w-full disabled:opacity-60")}>
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
        {pending ? "Verificando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
