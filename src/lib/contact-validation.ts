import { isServiceId, type ServiceId } from "@/data/services";

/**
 * Validación del formulario de contacto.
 *
 * Es una función pura (sin dependencias del navegador) para poder reutilizarla
 * en el servidor: si en el futuro el formulario guarda datos, el servidor debe
 * volver a validar con `validateContact` y no confiar en lo que llega del navegador.
 */
export type ContactFields = {
  name: string;
  phone: string;
  service: string;
  description: string;
  /** Autorización de tratamiento de datos (Ley 1581 de 2012): "si" cuando se acepta. */
  consent: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const contactLimits = {
  nameMin: 2,
  nameMax: 80,
  phoneMinDigits: 7,
  phoneMaxDigits: 15,
  descriptionMin: 15,
  descriptionMax: 1000,
} as const;

const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const phone = fields.phone.trim();
  const description = fields.description.trim();
  const phoneDigits = phone.replace(/\D/g, "");

  if (!name) errors.name = "Escribe tu nombre.";
  else if (name.length < contactLimits.nameMin) errors.name = "El nombre es demasiado corto.";
  else if (name.length > contactLimits.nameMax)
    errors.name = `Usa como máximo ${contactLimits.nameMax} caracteres.`;
  else if (!NAME_PATTERN.test(name)) errors.name = "Usa solo letras y espacios.";

  if (!phone) errors.phone = "Escribe un teléfono de contacto.";
  else if (!PHONE_PATTERN.test(phone))
    errors.phone = "Usa solo números; puedes incluir +, espacios o guiones.";
  else if (
    phoneDigits.length < contactLimits.phoneMinDigits ||
    phoneDigits.length > contactLimits.phoneMaxDigits
  )
    errors.phone = `El teléfono debe tener entre ${contactLimits.phoneMinDigits} y ${contactLimits.phoneMaxDigits} dígitos.`;

  if (!fields.service) errors.service = "Selecciona el servicio que te interesa.";
  else if (!isServiceId(fields.service)) errors.service = "Selecciona un servicio de la lista.";

  if (!description) errors.description = "Cuéntanos brevemente tu proyecto.";
  else if (description.length < contactLimits.descriptionMin)
    errors.description = `Añade un poco más de detalle (mínimo ${contactLimits.descriptionMin} caracteres).`;
  else if (description.length > contactLimits.descriptionMax)
    errors.description = `Usa como máximo ${contactLimits.descriptionMax} caracteres.`;

  if (fields.consent !== "si")
    errors.consent = "Debes autorizar el tratamiento de tus datos para continuar.";

  return errors;
}

export function toContactMessageData(fields: ContactFields) {
  return {
    name: fields.name.trim(),
    phone: fields.phone.trim(),
    serviceId: fields.service as ServiceId,
    description: fields.description.trim(),
  };
}
