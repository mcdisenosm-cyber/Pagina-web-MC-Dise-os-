# MC Diseños — sitio web

Sitio web de **MC Diseños**, diseño y fabricación de mobiliario a medida en láminas de RH:
cocinas integrales, muebles empotrados, clósets y armarios, puertas, y mesas y comedores.

Construido con Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 y Lucide React.
Es un sitio de una sola página, totalmente estático, sin base de datos ni backend: las
solicitudes de los visitantes continúan por WhatsApp.

---

## 1. Requisitos

- [Node.js](https://nodejs.org/) **20.9 o superior** (recomendado: la versión LTS más reciente).
- npm (se instala junto con Node.js).

Comprueba la instalación con:

```bash
node -v
npm -v
```

## 2. Instalación

En la carpeta del proyecto:

```bash
npm install
```

## 3. Configuración (variables de entorno)

1. Copia `.env.example` como `.env.local` en la raíz del proyecto.
2. Completa los valores:

```bash
# Número de WhatsApp de MC Diseños: código de país + número, SOLO dígitos.
NEXT_PUBLIC_WHATSAPP_NUMBER=
# URL pública del sitio, para metadatos, sitemap y robots.
NEXT_PUBLIC_SITE_URL=https://www.tu-dominio.com
```

### WhatsApp

- Formato: internacional, solo dígitos, **sin** `+`, espacios ni guiones.
  Por ejemplo, para un móvil de Colombia el formato sería `57` seguido de los 10 dígitos
  (como `573001234567`, que es solo un ejemplo ilustrativo, no un número real).
- Next.js incrusta esta variable al compilar. **Después de cambiarla, reinicia `npm run dev`
  o vuelve a ejecutar `npm run build`.**
- En el hosting (Vercel, Netlify, etc.) define la misma variable en la configuración de
  variables de entorno del proyecto y vuelve a desplegar.

Si el número está vacío o no es válido:

- No se genera ningún enlace a WhatsApp.
- Los botones "Cotizar por WhatsApp" llevan al formulario de contacto.
- El botón flotante y el formulario muestran un aviso claro. En modo desarrollo el aviso
  incluye además las instrucciones de configuración.

`.env.local` está excluido de Git. No guardes contraseñas ni claves en archivos `NEXT_PUBLIC_*`,
porque su contenido es visible en el navegador.

## 4. Ejecutar

```bash
npm run dev        # desarrollo en http://localhost:3000
npm run build      # compilación de producción
npm run start      # sirve la compilación de producción
```

## 5. Verificaciones

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run build      # compilación completa
```

## 6. Estructura

```
src/
  app/
    layout.tsx           Metadatos SEO, Open Graph, fuentes
    page.tsx             Composición de la página
    globals.css          Paleta, tipografía, animaciones, foco
    icon.png             Favicon (símbolo del logo)
    apple-icon.png       Icono para iOS
    sitemap.ts, robots.ts
  config/site.ts         Nombre, eslogan, logo, navegación, redes sociales
  data/                  CONTENIDO (separado del diseño)
    images.ts            Registro central de todas las imágenes
    services.ts          Las 5 categorías autorizadas
    projects.ts          Proyectos de la galería (actualmente demostrativos)
    materials.ts         Muestras de acabados (referencias visuales)
    process.ts           Pasos del proceso de trabajo
  lib/
    whatsapp.ts          Número, validación y mensajes de WhatsApp
    contact-validation.ts Validación del formulario
  components/
    layout/              SiteHeader (menú móvil), SiteFooter
    sections/            Hero, Manifesto, Services, Projects, Materials,
                         Process, CallToAction, Contact
    gallery/             ProjectGallery (filtros), Lightbox
    contact/             ContactForm
    whatsapp/            WhatsAppLink, WhatsAppFloat, aviso de configuración
    ui/                  Logo, SectionHeading, estilos de botón
public/brand/            Logotipo (original y versiones transparentes)
```

Los componentes son de servidor por defecto. Solo son de cliente los que necesitan
interactividad: header (menú móvil), galería y lightbox, formulario y botón flotante.

## 7. Cómo actualizar el contenido

### Logotipo
- Original: `public/brand/logo-mc-disenos-original.jpg`.
- Versión usada en el sitio: `public/brand/logo-mc-disenos.png` (fondo transparente, para
  fondos claros). También hay una versión horizontal solo con el nombre:
  `public/brand/logo-mc-disenos-horizontal.png`.
- Se configura en `src/config/site.ts` (`logo`).
- El original es un JPG de 960 px. **Si la empresa tiene el logo en vector (SVG, AI o PDF),
  conviene reemplazarlo** para que se vea más nítido en pantallas de alta resolución.
- El favicon (`src/app/icon.png` y `apple-icon.png`) se generó a partir del símbolo del logo.

### Proyectos de la galería: panel de administración
Los proyectos se administran desde el panel **`/admin`** (enlace "Iniciar sesión" en el pie de
página), sin tocar código:

1. Pulsa **Iniciar sesión** → **Iniciar sesión con Google** y entra con la cuenta autorizada.
   Solo pueden entrar los correos de la variable `ADMIN_EMAILS`.
2. **Nuevo proyecto** para crear uno, o **Editar / Eliminar** en la lista.
3. Completa título, categoría, descripción, foto, descripción de la foto, formato y posición
   (números menores aparecen primero). La foto se reduce automáticamente antes de subirla.
4. Pulsa **Publicar proyecto** / **Guardar cambios**. El panel guarda el cambio en GitHub y
   Vercel vuelve a publicar la web en 1–2 minutos.

Dónde se guarda: `src/content/proyectos/<proyecto>.json` y la foto en
`public/images/proyectos/<proyecto>/imagen.jpg`. Formato y validación en
`src/lib/project-content.ts`; lectura para la web en `src/server/projects.ts`; escritura en
GitHub en `src/server/github-content.ts`; inicio de sesión en `src/server/auth.ts`.

#### Configuración del panel (una sola vez)
Variables de entorno (en Vercel: Settings → Environment Variables; en local: `.env.local`):

| Variable | Qué es |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales OAuth de Google (Google Cloud Console). |
| `NEXTAUTH_SECRET` | Clave aleatoria para cifrar la sesión (`openssl rand -base64 32`). |
| `NEXTAUTH_URL` | URL pública del sitio, por ejemplo `https://pagina-web-mc-dise-os.vercel.app`. |
| `ADMIN_EMAILS` | Correos autorizados, separados por comas. |
| `GITHUB_CONTENT_TOKEN` | Token de GitHub de grano fino, solo para este repositorio, con permiso *Contents: Read and write*. |

**Google:** en [Google Cloud Console](https://console.cloud.google.com/) → APIs y servicios →
Pantalla de consentimiento de OAuth (tipo Externo) → Credenciales → Crear ID de cliente de OAuth
(Aplicación web). URI de redireccionamiento autorizados:
`https://<tu-dominio>/api/auth/callback/google` (y `http://localhost:3000/api/auth/callback/google`
para pruebas locales).

**GitHub:** Settings → Developer settings → Personal access tokens → Fine-grained tokens →
Generate new token → *Only select repositories* (este repositorio) → *Repository permissions:
Contents: Read and write*. Ponle fecha de vencimiento y renuévalo antes de que expire.

Sin estas variables, `/admin` muestra "Panel no disponible" y la web funciona igual.
### Fotografías fijas del sitio
Hero, servicios, llamada a la acción y taller usan fotos reales guardadas en
`public/images/sitio/` y `public/images/taller/`, registradas en `src/data/images.ts`. Para
cambiarlas, reemplaza el archivo o actualiza `src` y `alt` en ese registro.

Solo las texturas de la sección de materiales siguen siendo referencias de Unsplash. Cuando ya
no se use ninguna imagen de Unsplash, puedes eliminar `remotePatterns` en `next.config.ts`.

### Materiales
Edita `src/data/materials.ts`. Cuando las muestras correspondan al inventario confirmado,
pon `isReference: false` y usa los nombres reales. No añadas marcas ni especificaciones sin
confirmarlas.

### Redes sociales
Añade enlaces reales en `siteConfig.social` (`src/config/site.ts`); aparecen en el footer.

### Preparado para un CMS
El contenido vive en módulos de datos tipados (`src/data/*`). Para conectar un CMS más adelante,
basta con reemplazar esos módulos por funciones que lean del CMS y devuelvan los mismos tipos,
sin tocar los componentes visuales.

## Seguridad y datos personales

Lee [SECURITY.md](SECURITY.md) antes de publicar el sitio o subirlo a GitHub. Resume:

- Cabeceras de seguridad configuradas en `next.config.ts`.
- Política de tratamiento de datos en `/politica-de-privacidad` y casilla de autorización
  en el formulario (Ley 1581 de 2012).
- Los secretos se leen solo en el servidor con `src/server/env.ts`; nunca con `NEXT_PUBLIC_`.
- Reglas a seguir si en el futuro se guardan datos o se añade el chatbot.

## 8. Accesibilidad y rendimiento

- Navegación por teclado, enlace "Saltar al contenido", estados de foco visibles.
- Menú móvil y lightbox con cierre por Escape y gestión del foco; lightbox con flechas.
- Formulario con etiquetas, mensajes de error asociados y foco en el primer campo inválido.
- Animaciones sutiles que se desactivan con la preferencia "reducir movimiento".
- Imágenes optimizadas con `next/image` (AVIF/WebP, tamaños responsivos, carga diferida).

## 9. Datos de la empresa

Configurados:

- WhatsApp: +57 321 363 7113 (en `.env.local`; al publicar, definir también
  `NEXT_PUBLIC_WHATSAPP_NUMBER=573213637113` en el hosting).
- Correo, dirección, ciudad y Facebook: `siteConfig.contact` y `siteConfig.social` en
  `src/config/site.ts`.
- Logotipo y favicon.
- Fotos reales de proyectos y del taller.
- Categorías: las 5 de mobiliario más "Diseños en CNC" (`src/data/services.ts`).

Pendientes:

- Dominio definitivo (`NEXT_PUBLIC_SITE_URL`).
- Catálogo confirmado de láminas y acabados (las texturas actuales son referencias).
- Otras redes sociales, si existen (por ejemplo Instagram o TikTok).
- Logotipo en formato vectorial (opcional, para mayor nitidez).
- Confirmación de los pasos del proceso (diseño, fabricación, instalación y entrega).
