"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown, CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { ServiceId } from "@/data/services";
import {
  contactLimits,
  toContactMessageData,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact-validation";
import { buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { WhatsAppSetupNotice } from "@/components/whatsapp/WhatsAppSetupNotice";

type ContactFormProps = {
  services: { id: ServiceId; title: string }[];
  whatsappConfigured: boolean;
};

type Status = { kind: "idle" } | { kind: "opened"; url: string } | { kind: "not-configured" };

const emptyFields: ContactFields = { name: "", phone: "", service: "", description: "", consent: "" };
const fieldOrder: (keyof ContactFields)[] = ["name", "phone", "service", "description", "consent"];

export function ContactForm({ services, whatsappConfigured }: ContactFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<ContactFields>(emptyFields);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const ids = {
    name: `${uid}-nombre`,
    phone: `${uid}-telefono`,
    service: `${uid}-servicio`,
    description: `${uid}-descripcion`,
    consent: `${uid}-autorizacion`,
  };

  const update = (key: keyof ContactFields, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    setStatus({ kind: "idle" });
    // Tras el primer intento, la validación se actualiza mientras se escribe.
    if (submitted) setErrors(validateContact(next));
  };

  const onBlur = (key: keyof ContactFields) => {
    if (!fields[key].trim() && !submitted) return;
    const fieldError = validateContact(fields)[key];
    setErrors((current) => ({ ...current, [key]: fieldError }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateContact(fields);
    setErrors(nextErrors);

    const firstInvalid = fieldOrder.find((key) => nextErrors[key]);
    if (firstInvalid) {
      setStatus({ kind: "idle" });
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(ids[firstInvalid])}`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(whatsappMessages.contactForm(toContactMessageData(fields)));
    if (!url) {
      setStatus({ kind: "not-configured" });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setStatus({ kind: "opened", url });
  };

  const fieldClass = (key: keyof ContactFields) =>
    `mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-base text-carbon placeholder:text-stone-deep/80 transition-[border-color,box-shadow] focus:outline-none focus-visible:outline-none ${
      errors[key]
        ? "border-red-700 focus:shadow-[0_1px_0_0_var(--color-red-700)]"
        : "border-carbon/30 focus:border-carbon focus:shadow-[0_1px_0_0_var(--color-carbon)]"
    }`;

  const describedBy = (key: keyof ContactFields, hint?: string) =>
    [hint, errors[key] ? `${ids[key]}-error` : null].filter(Boolean).join(" ") || undefined;

  const errorText = (key: keyof ContactFields) =>
    errors[key] ? (
      <p id={`${ids[key]}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red-800">
        <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  const errorCount = fieldOrder.filter((key) => errors[key]).length;
  const descriptionLength = fields.description.trim().length;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${uid}-nota`}
      className="bg-warm p-6 sm:p-10"
    >
      <p id={`${uid}-nota`} className="text-sm text-stone-deep">
        Todos los campos son obligatorios.
      </p>

      {submitted && errorCount > 0 ? (
        <p role="alert" className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
          Revisa {errorCount === 1 ? "el campo marcado" : `los ${errorCount} campos marcados`} para
          continuar.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="eyebrow text-carbon">
            Nombre
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={contactLimits.nameMax}
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={fieldClass("name")}
            placeholder="Tu nombre"
          />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor={ids.phone} className="eyebrow text-carbon">
            Teléfono
          </label>
          <input
            id={ids.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={24}
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            onBlur={() => onBlur("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className={fieldClass("phone")}
            placeholder="Número de contacto"
          />
          {errorText("phone")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.service} className="eyebrow text-carbon">
            Servicio de interés
          </label>
          <div className="relative">
            <select
              id={ids.service}
              name="service"
              required
              value={fields.service}
              onChange={(e) => update("service", e.target.value)}
              onBlur={() => onBlur("service")}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={describedBy("service")}
              className={`${fieldClass("service")} cursor-pointer appearance-none pr-8 ${
                fields.service ? "" : "text-stone-deep"
              }`}
            >
              <option value="" disabled>
                Selecciona un servicio
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id} className="text-carbon">
                  {service.title}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-0 size-5 -translate-y-1/2 text-carbon"
            />
          </div>
          {errorText("service")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.description} className="eyebrow text-carbon">
            Descripción del proyecto
          </label>
          <textarea
            id={ids.description}
            name="description"
            required
            rows={5}
            maxLength={contactLimits.descriptionMax}
            value={fields.description}
            onChange={(e) => update("description", e.target.value)}
            onBlur={() => onBlur("description")}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy("description", `${ids.description}-ayuda`)}
            className={`${fieldClass("description")} resize-y`}
            placeholder="Espacio, medidas aproximadas, estilo o acabados que te gustan…"
          />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">{errorText("description")}</div>
            <p id={`${ids.description}-ayuda`} className="mt-2 shrink-0 text-xs text-stone-deep">
              {descriptionLength}/{contactLimits.descriptionMax}
              <span className="sr-only"> caracteres</span>
            </p>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={ids.consent}
              name="consent"
              type="checkbox"
              required
              checked={fields.consent === "si"}
              onChange={(e) => update("consent", e.target.checked ? "si" : "")}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describedBy("consent")}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-carbon"
            />
            <label htmlFor={ids.consent} className="cursor-pointer text-sm leading-relaxed text-stone-deep">
              Autorizo a {siteConfig.legal.companyName} a tratar mis datos personales para responder
              mi solicitud, de acuerdo con la{" "}
              <Link
                href={siteConfig.legal.privacyPolicyPath}
                target="_blank"
                className="font-semibold text-carbon underline underline-offset-4"
              >
                política de tratamiento de datos
                <span className="sr-only"> (se abre en una nueva pestaña)</span>
              </Link>
              .
            </label>
          </div>
          {errorText("consent")}
        </div>
      </div>

      {!whatsappConfigured ? (
        <div className="mt-8 border-l-2 border-wood bg-paper px-4 py-4" role="note">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-carbon">
            <CircleAlert className="size-4 text-wood-deep" aria-hidden="true" />
            WhatsApp no está configurado
          </p>
          <WhatsAppSetupNotice />
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className={buttonClasses("solid", "w-full sm:w-auto")}>
          <WhatsAppIcon className="size-[1.1rem]" />
          Continuar por WhatsApp
        </button>
        <p className="text-xs leading-relaxed text-stone-deep sm:max-w-[16rem] sm:text-right">
          Tus datos no se almacenan en esta página; solo se usan para redactar el mensaje.
        </p>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {status.kind === "opened" ? (
          <p className="mt-6 flex items-start gap-2 border-l-2 border-wood bg-paper px-4 py-3 text-sm text-carbon">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-wood-deep" aria-hidden="true" />
            <span>
              Abrimos WhatsApp con tu mensaje en una nueva pestaña. Recuerda enviarlo para que
              recibamos tu solicitud.{" "}
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
              >
                ¿No se abrió? Ábrelo aquí
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </span>
          </p>
        ) : null}
        {status.kind === "not-configured" ? (
          <p role="alert" className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
            Tu solicitud está completa, pero no se puede enviar porque WhatsApp aún no está
            configurado en esta página. No se envió ni guardó ninguna información.
          </p>
        ) : null}
      </div>
    </form>
  );
}
