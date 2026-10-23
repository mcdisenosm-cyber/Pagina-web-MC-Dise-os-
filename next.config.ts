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
 * CSP del panel de administración (/keystatic). Igual de restrictiva que la del
 * sitio, pero permite hablar con la API de GitHub (donde se guarda el contenido),
 * mostrar avatares de GitHub e imágenes en memoria (blob:) al subir fotos.
 */
const adminContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // La interfaz de Keystatic carga su tipografía (Inter) desde Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://avatars.githubusercontent.com https://*.githubusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.github.com https://github.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
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
  // Solo desarrollo: el panel (modo GitHub) redirige a 127.0.0.1, que es lo que exige
  // GitHub para el inicio de sesión local. No afecta a producción.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    const adminHeaders = [
      { key: "Content-Security-Policy", value: adminContentSecurityPolicy },
      // El panel nunca debe aparecer en buscadores.
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    // Las reglas posteriores reemplazan a las anteriores cuando repiten la cabecera.
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/keystatic", headers: adminHeaders },
      { source: "/keystatic/:path*", headers: adminHeaders },
      { source: "/api/keystatic/:path*", headers: adminHeaders },
    ];
  },
  // El contenido del panel (JSON) se lee en el servidor: hay que incluirlo en el despliegue.
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
