"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppSetupNotice } from "./WhatsAppSetupNotice";

/** Botón flotante de WhatsApp presente en todo el sitio. */
export function WhatsAppFloat() {
  const url = buildWhatsAppUrl(whatsappMessages.general());
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const bubble =
    "on-dark flex size-14 items-center justify-center rounded-full shadow-[0_12px_32px_-12px_rgb(32_34_31/0.55)] transition-[transform,background-color] duration-300 ease-editorial hover:-translate-y-0.5";

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bubble} bg-carbon text-warm hover:bg-wood-deep`}
          aria-label="Escribir a MC Diseños por WhatsApp (se abre en una nueva pestaña)"
        >
          <WhatsAppIcon className="size-6" />
        </a>
      ) : (
        <>
          {open ? (
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-label="WhatsApp no disponible"
              className="w-[min(20rem,calc(100vw-2rem))] border border-carbon/10 bg-warm p-5 text-sm shadow-[0_20px_50px_-20px_rgb(32_34_31/0.45)]"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <p className="font-semibold text-carbon">WhatsApp aún no está disponible</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className="-m-1 p-1 text-stone-deep hover:text-carbon"
                  aria-label="Cerrar aviso"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <WhatsAppSetupNotice compact />
            </div>
          ) : null}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            className={`${bubble} bg-stone text-warm`}
            aria-label="WhatsApp no configurado: ver información"
          >
            <WhatsAppIcon className="size-6" />
          </button>
        </>
      )}
    </div>
  );
}
