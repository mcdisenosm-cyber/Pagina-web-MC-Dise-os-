import { siteConfig } from "@/config/site";
import { servicesById, type ServiceId } from "@/data/services";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (código de país + número).
 * Se lee de NEXT_PUBLIC_WHATSAPP_NUMBER. Next.js incrusta esta variable al compilar,
 * por lo que tras cambiarla hay que reiniciar `npm run dev` o volver a ejecutar `npm run build`.
 *
 * Importante: el acceso debe ser literal (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
 * para que Next.js pueda reemplazarlo en el código del navegador.
 */
const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/** E.164 admite hasta 15 dígitos; exigimos un mínimo razonable de 8. */
const VALID_NUMBER = /^[1-9]\d{7,14}$/;

export const WHATSAPP_ENV_VAR = "NEXT_PUBLIC_WHATSAPP_NUMBER";

export function getWhatsAppNumber(): string | null {
  const value = RAW_NUMBER?.trim() ?? "";
  return VALID_NUMBER.test(value) ? value : null;
}

export function isWhatsAppConfigured(): boolean {
  return getWhatsAppNumber() !== null;
}

/** Número en formato legible, por ejemplo "+57 321 363 7113". */
export function formatWhatsAppNumber(): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  const colombia = /^57(\d{3})(\d{3})(\d{4})$/.exec(number);
  return colombia ? `+57 ${colombia[1]} ${colombia[2]} ${colombia[3]}` : `+${number}`;
}

/** Devuelve el enlace wa.me con el texto preparado, o null si no hay número válido. */
export function buildWhatsAppUrl(message: string): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: () =>
    `Hola, ${siteConfig.name}. Me gustaría recibir asesoría para un proyecto de mobiliario a medida.`,
  service: (serviceId: ServiceId) =>
    `Hola, ${siteConfig.name}. Quiero cotizar un proyecto de ${servicesById[serviceId].inSentence}. ¿Me pueden asesorar?`,
  project: (projectTitle: string, serviceId: ServiceId) =>
    `Hola, ${siteConfig.name}. Vi el ejemplo "${projectTitle}" (${servicesById[serviceId].title}) en su página web y quiero cotizar algo similar.`,
  contactForm: (data: {
    name: string;
    phone: string;
    serviceId: ServiceId;
    description: string;
  }) =>
    [
      `Hola, ${siteConfig.name}. Quiero solicitar una cotización.`,
      "",
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone}`,
      `Servicio de interés: ${servicesById[data.serviceId].title}`,
      "",
      "Descripción del proyecto:",
      data.description,
      "",
      `Autorizo el tratamiento de mis datos personales según la política de ${siteConfig.legal.companyName}.`,
    ].join("\n"),
};
