# Seguridad — sitio web de MC Diseños

Guía para mantener el sitio seguro al publicarlo en un servidor y en GitHub, y para
cuando se añadan funciones que guarden información o un chatbot.

## Estado actual

- El sitio **no guarda datos personales de visitantes**. El formulario valida la información
  en el navegador y abre WhatsApp con el mensaje redactado; no hay base de datos.
- El formulario pide **autorización expresa** de tratamiento de datos (Ley 1581 de 2012) y
  enlaza a la [política de privacidad](src/app/politica-de-privacidad/page.tsx).
- **Cabeceras de seguridad** configuradas en `next.config.ts`: Content-Security-Policy,
  HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy y
  Cross-Origin-Opener-Policy. También se oculta la cabecera `X-Powered-By`.
- No hay secretos en el código. `.env.local` y los archivos de datos/respaldo están
  excluidos en `.gitignore`.

## Panel de administración (/admin)

- **Inicio de sesión con Google** (next-auth). Google gestiona la contraseña y la
  verificación en dos pasos; la web nunca recibe ni guarda contraseñas.
- Solo entran los correos de `ADMIN_EMAILS` y solo si Google confirma que el correo está
  verificado. Cualquier otra cuenta ve "no tiene permiso". Para dar o quitar acceso, edita
  esa variable en Vercel y vuelve a desplegar.
- **Cada acción del servidor vuelve a comprobar la sesión** (`requireAdmin()` en
  `src/server/auth.ts`) y vuelve a validar los datos; no se confía en el navegador.
- La sesión es una cookie cifrada, httpOnly, y dura 8 horas.
- Las fotos se validan por contenido (JPG/PNG/WebP reales, máx. 3 MB), se reprocesan y se
  les quitan los metadatos EXIF/GPS antes de publicarse.
- Los cambios se guardan como commits en GitHub con un **token de grano fino limitado a este
  repositorio** (`GITHUB_CONTENT_TOKEN`, permiso *Contents* únicamente). Nunca se reescribe el
  historial (sin *force push*) y los mensajes de commit no incluyen correos.
- Sin las variables necesarias, `/admin` muestra "Panel no disponible".
- El panel tiene `X-Robots-Tag: noindex`, está bloqueado en `robots.txt` y tiene su propia CSP
  (solo añade `accounts.google.com` y las fotos de perfil de Google).
- `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` y `GITHUB_CONTENT_TOKEN` son secretos: solo en el
  panel de Vercel/servidor, nunca en el código ni en el chat.
- Activa la verificación en dos pasos en la cuenta de Google del administrador y renueva el
  token de GitHub antes de su vencimiento.

## Reglas para todo el equipo

1. **Secretos fuera del código.** Claves y contraseñas van en variables de entorno del
   servidor (panel del hosting) y **nunca** con prefijo `NEXT_PUBLIC_`. Se leen con
   `getServerSecret()` de `src/server/env.ts`.
2. **Antes de cada `git push`**, revisa que no se suban `.env*` (salvo `.env.example`),
   bases de datos, respaldos ni archivos con datos de clientes.
3. **Actualiza dependencias** cuando haya parches de seguridad (`npm audit`, Dependabot).
4. En el servidor usa siempre `npm run build` + `npm run start`. **Nunca `npm run dev`.**

## Al publicar

- [ ] HTTPS activo (certificado válido) en el dominio.
- [ ] Definir `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_SITE_URL` en el hosting.
- [ ] Node.js LTS actualizado en el servidor.
- [ ] En GitHub: activar Dependabot alerts, *secret scanning* y *push protection*, y
      proteger la rama principal.
- [ ] Revisar la política de privacidad con la empresa (y su asesor legal) y confirmar NIT,
      dirección y correo de contacto.

## Si en el futuro se GUARDAN datos (formularios, solicitudes, clientes)

- Todo el acceso a datos vive en `src/server/` con `import "server-only"`.
- **Validar en el servidor** con `validateContact()` (`src/lib/contact-validation.ts`);
  nunca confiar solo en la validación del navegador.
- Las *Server Actions* y rutas `/api` son públicas: cualquiera puede llamarlas. Añadir
  **límite de solicitudes** y un **captcha** (por ejemplo Cloudflare Turnstile).
- Base de datos con acceso solo desde el servidor, cifrado, contraseñas fuertes y
  **copias de seguridad**. Guardar solo los datos necesarios y por el tiempo necesario.
- Registrar la autorización de cada persona (fecha y texto aceptado) y atender
  solicitudes de consulta, corrección o eliminación (Ley 1581).
- No registrar datos personales en los logs.
- Actualizar la sección "Datos que recolectamos" de la política de privacidad.

## Cuando se incorpore el chatbot

- La clave de la API se usa **solo en el servidor** (ruta `/api/chat`); el navegador nunca
  la ve.
- Límite de mensajes por usuario, límite de longitud por mensaje, captcha y **tope de
  gasto mensual** en el proveedor de IA.
- El bot solo conoce información pública (servicios, dirección, horarios). **No** se le da
  acceso a la base de datos ni a datos de clientes: así, aunque alguien intente manipularlo,
  no hay nada privado que pueda revelar.
- Avisar que es un asistente automático y ofrecer siempre el paso a WhatsApp.
- No guardar conversaciones, o guardarlas con autorización y por un tiempo limitado.
- Añadir el dominio del proveedor (si el navegador debe conectarse a él) en la directiva
  `connect-src` de la CSP en `next.config.ts`.

## Reportar un problema de seguridad

Escribe a almacenmcdisenos@hotmail.com con el asunto "Seguridad sitio web". No publiques
el detalle del problema en un *issue* público.
