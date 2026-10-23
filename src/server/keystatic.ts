import "server-only";
import { keystaticUsesGitHub } from "../../keystatic.config";

/**
 * Indica si el panel /keystatic puede funcionar en este entorno.
 *
 * - En desarrollo siempre (modo local o GitHub).
 * - En producción solo en modo GitHub y con las variables de la GitHub App definidas.
 *   El modo "local" no tiene inicio de sesión y escribiría en el disco del servidor,
 *   por eso nunca se habilita en producción.
 */
export function isKeystaticEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const githubConfigured = Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );
  return keystaticUsesGitHub && githubConfigured;
}
