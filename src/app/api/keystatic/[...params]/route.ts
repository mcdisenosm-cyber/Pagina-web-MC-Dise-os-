import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { isKeystaticEnabled } from "@/server/keystatic";

/**
 * API del panel: inicio de sesión con GitHub y lectura/escritura del contenido.
 * Los secretos (KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET) solo se usan aquí,
 * en el servidor.
 *
 * Seguridad:
 * - En producción solo se permite el modo GitHub (exige iniciar sesión con una cuenta
 *   con permiso de escritura en el repositorio). El modo "local" no tiene inicio de
 *   sesión y escribe en el disco del servidor, así que queda desactivado.
 * - Si faltan las variables de la GitHub App, la API responde 404.
 */
const enabled = isKeystaticEnabled();

const disabled = () =>
  new Response("Panel de administración no configurado.", { status: 404 });

const handlers = enabled ? makeRouteHandler({ config }) : { GET: disabled, POST: disabled };

export const GET = handlers.GET;
export const POST = handlers.POST;
