import type { ReactNode } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  message: string;
  className?: string;
  children: ReactNode;
  /** Etiqueta accesible adicional, útil cuando el texto visible es corto. */
  ariaLabel?: string;
  /**
   * Destino interno cuando WhatsApp no está configurado.
   * Por defecto lleva al formulario de contacto, donde se explica cómo configurarlo.
   * Con `null` se muestra el elemento desactivado.
   */
  fallbackHref?: string | null;
};

/**
 * Enlace reutilizable a WhatsApp con un mensaje preparado.
 * Nunca genera un enlace inválido: sin número configurado redirige al
 * formulario de contacto o se muestra desactivado.
 */
export function WhatsAppLink({
  message,
  className,
  children,
  ariaLabel,
  fallbackHref = "#contacto",
}: WhatsAppLinkProps) {
  const url = buildWhatsAppUrl(message);

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel ? `${ariaLabel} (se abre WhatsApp en una nueva pestaña)` : undefined}
      >
        {children}
      </a>
    );
  }

  if (fallbackHref) {
    return (
      <a href={fallbackHref} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <span
      role="link"
      aria-disabled="true"
      aria-label={ariaLabel ? `${ariaLabel} (WhatsApp no disponible)` : undefined}
      className={`${className ?? ""} opacity-50`}
    >
      {children}
    </span>
  );
}
