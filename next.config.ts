import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Política de seguridad de contenido (CSP): define desde dónde puede cargar
 * la página scripts, estilos, imágenes, etc. Todo se sirve desde el propio
 * dominio (las imágenes remotas pasan por el optimizador de Next.js).
 *
 * Se usa la variante "sin nonces" recomendada por Next.js para sitios estáticos:
 * 'unsafe-inline' en scripts es necesario para los datos que Next.js inserta en la
 * página. 'unsafe-eval' solo se habilita en desarrollo.
 *
 * Si en el futuro se añade un servicio externo (analítica, chatbot, captcha),
 * hay que autorizar su dominio aquí en la directiva correspondiente.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

/**
 * CSP del panel de administración (/admin). Igual de restrictiva que la del sitio:
 * todo se sirve desde el propio dominio (blob: permite la vista previa de la foto).
 */
const adminContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Obliga a usar HTTPS durante 2 años (los navegadores lo ignoran en http://localhost).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Impide que otra web muestre esta página dentro de un iframe (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Evita que el navegador "adivine" el tipo de los archivos.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No envía la URL completa a otros sitios al salir de la página.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva funciones del navegador que la web no usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Aísla la ventana de otras pestañas abiertas desde la página.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // No revela que el sitio usa Next.js en las cabeceras de respuesta.
  poweredByHeader: false,
  experimental: {
    // El panel envía fotos ya reducidas en el navegador (< 1 MB normalmente). 3 MB deja
    // margen y sigue por debajo del límite de 4,5 MB por solicitud de Vercel.
    serverActions: { bodySizeLimit: "3mb" },
  },
  async headers() {
    const adminHeaders = [
      { key: "Content-Security-Policy", value: adminContentSecurityPolicy },
      // El panel nunca debe aparecer en buscadores.
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    // Las reglas posteriores reemplazan a las anteriores cuando repiten la cabecera.
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
  // El contenido de la galería (JSON) se lee en el servidor: hay que incluirlo en el despliegue.
  outputFileTracingIncludes: {
    "/": ["./src/content/**/*"],
  },
  images: {
    // Texturas de referencia de Unsplash (sección de materiales). Al reemplazarlas
    // por fotografías locales en /public, esta entrada puede eliminarse.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
