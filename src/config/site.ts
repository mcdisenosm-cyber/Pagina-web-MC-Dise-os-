/**
 * Configuración general del sitio.
 * Solo contiene datos reales y públicos de la empresa; no añadir datos sin confirmar.
 * El número de WhatsApp se configura aparte en NEXT_PUBLIC_WHATSAPP_NUMBER (.env.local).
 */

export type SocialLink = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "MC Diseños",
  slogan: "Diseñamos espacios. Creamos experiencias",
  title: "MC Diseños | Cocinas y Muebles a Medida",
  description:
    "Diseño y fabricación de cocinas integrales, muebles empotrados, clósets, puertas y mesas de comedor a medida en láminas de RH, con más de 30 años de experiencia en Pitalito, Huila. Cotiza tu proyecto por WhatsApp.",
  /**
   * URL pública del sitio. Prioridad: NEXT_PUBLIC_SITE_URL (dominio propio) →
   * dominio de producción que Vercel asigna automáticamente → localhost.
   */
  url:
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeUrl(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
    ) ??
    "http://localhost:3000",
  locale: "es_CO",
  /** Años de experiencia confirmados por la empresa (aparece en la fachada de su sede). */
  experienceYears: 30,
  /**
   * Logotipo oficial (PNG transparente generado a partir de /public/brand/logo-mc-disenos-original.jpg).
   * Está pensado para fondos claros. Si la empresa dispone del archivo vectorial (SVG/AI/PDF),
   * conviene sustituirlo aquí para ganar nitidez. Con null se muestra el nombre en texto.
   */
  logo: { src: "/brand/logo-mc-disenos.png", width: 870, height: 456 } as null | {
    src: string;
    width: number;
    height: number;
  },
  /** Datos públicos de contacto (tomados de la página oficial de Facebook y las publicaciones de la empresa). */
  contact: {
    email: "almacenmcdisenos@hotmail.com",
    address: "Calle 4 No. 1E-43",
    city: "Pitalito, Huila, Colombia",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Calle 4 # 1E-43, Pitalito, Huila, Colombia"),
  },
  /**
   * Datos del responsable del tratamiento de datos personales (Ley 1581 de 2012).
   * NIT tomado del Registro Único Empresarial (RUES). Confirmar con la empresa.
   */
  legal: {
    companyName: "MC Diseños S.A.S.",
    nit: "900.473.890",
    privacyPolicyPath: "/politica-de-privacidad",
    privacyPolicyUpdated: "23 de octubre de 2026",
  },
  /** Redes sociales reales. Se muestran en el footer y el contacto. */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/MCDisenosSAS" },
  ] as SocialLink[],
} as const;

export const navigation = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Materiales", href: "/#materiales" },
  { label: "Contacto", href: "/#contacto" },
] as const;

function normalizeUrl(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
