import { WHATSAPP_ENV_VAR } from "@/lib/whatsapp";

type WhatsAppSetupNoticeProps = {
  compact?: boolean;
};

/**
 * Mensaje que se muestra cuando NEXT_PUBLIC_WHATSAPP_NUMBER no está configurado.
 * En desarrollo incluye las instrucciones técnicas; en producción muestra solo
 * un mensaje claro para el visitante.
 */
export function WhatsAppSetupNotice({ compact = false }: WhatsAppSetupNoticeProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className={`space-y-2 leading-relaxed text-stone-deep ${compact ? "text-sm" : "text-[0.95rem]"}`}>
      <p>
        El contacto por WhatsApp todavía no está activo en esta página, por eso no se abrirá
        ningún chat.
      </p>
      {isDev ? (
        <p>
          <strong className="font-semibold text-carbon">Para configurarlo:</strong> crea el archivo{" "}
          <code className="bg-paper px-1 py-0.5 text-[0.85em] text-carbon">.env.local</code> en la raíz
          del proyecto con{" "}
          <code className="bg-paper px-1 py-0.5 text-[0.85em] break-all text-carbon">
            {WHATSAPP_ENV_VAR}=códigodepaísynúmero
          </code>{" "}
          (solo dígitos, sin +, espacios ni guiones) y reinicia el servidor. Consulta el README.
        </p>
      ) : (
        <p>Mientras se habilita, vuelve a intentarlo más tarde.</p>
      )}
    </div>
  );
}
