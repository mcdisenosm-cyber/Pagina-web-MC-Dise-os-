import "server-only";

/**
 * Lectura de variables de entorno SECRETAS (claves de base de datos, de la API
 * del chatbot, de servicios de correo, etc.).
 *
 * - `import "server-only"` hace que la compilación falle si este archivo llega
 *   a importarse desde un componente del navegador.
 * - Los secretos NUNCA deben llevar el prefijo NEXT_PUBLIC_: ese prefijo hace
 *   que Next.js los incluya en el código que descarga cualquier visitante.
 * - Todo el código que guarde o lea datos personales debe vivir en /src/server
 *   y usar esta función para obtener sus credenciales.
 *
 * Ejemplo (cuando exista):
 *   const apiKey = getServerSecret("ANTHROPIC_API_KEY");
 */
export function getServerSecret(name: string): string {
  if (name.startsWith("NEXT_PUBLIC_")) {
    throw new Error(
      `La variable ${name} es pública. Los secretos no deben usar el prefijo NEXT_PUBLIC_.`,
    );
  }
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno secreta ${name} en el servidor.`);
  }
  return value;
}
