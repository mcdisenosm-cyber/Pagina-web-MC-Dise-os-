import "server-only";
import { createHmac, pbkdf2, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";

/**
 * Inicio de sesión propio del panel /admin (correo + contraseña).
 *
 * - Un único administrador: ADMIN_EMAIL.
 * - La contraseña NUNCA se guarda: solo su huella PBKDF2-SHA256 (ADMIN_PASSWORD_HASH),
 *   generada con tools/generar-clave-admin.html. Formato:
 *   pbkdf2-sha256$<iteraciones>$<sal base64>$<huella base64>
 * - La sesión es una cookie firmada con HMAC-SHA256 (ADMIN_SESSION_SECRET), httpOnly,
 *   Secure (en producción), SameSite=Strict, con vencimiento de 8 horas.
 * - Protección contra fuerza bruta: límite de intentos por IP y por correo, y demora
 *   en cada intento fallido. Los mensajes no revelan qué dato falló.
 */

const COOKIE_NAME = "mc_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const MIN_ITERATIONS = 100_000;
const pbkdf2Async = promisify(pbkdf2);

type AuthConfig = { email: string; passwordHash: string; sessionSecret: string };

function config(): AuthConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !passwordHash || !sessionSecret || sessionSecret.length < 32) return null;
  return { email, passwordHash, sessionSecret };
}

export function isAdminConfigured(): boolean {
  return config() !== null;
}

/* ----------------------------- Contraseña ----------------------------- */

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsText, saltB64, hashB64] = stored.split("$");
  const iterations = Number(iterationsText);
  if (scheme !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < MIN_ITERATIONS) return false;
  const salt = Buffer.from(saltB64 ?? "", "base64");
  const expected = Buffer.from(hashB64 ?? "", "base64");
  if (salt.length < 16 || expected.length < 32) return false;
  const actual = await pbkdf2Async(password, salt, iterations, expected.length, "sha256");
  return timingSafeEqual(actual, expected);
}

function safeEqualText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/* ------------------------- Límite de intentos ------------------------- */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; first: number }>();

function isLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function registerFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) attempts.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
  // Evita que el mapa crezca sin límite.
  if (attempts.size > 5000) attempts.clear();
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconocida";
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------ Sesión ------------------------------- */

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createToken(email: string, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function readToken(token: string, cfg: AuthConfig): string | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqualText(signature, sign(payload, cfg.sessionSecret))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e?: string; x?: number };
    if (typeof data.x !== "number" || data.x < Date.now() / 1000) return null;
    return data.e === cfg.email ? data.e : null;
  } catch {
    return null;
  }
}

export type LoginResult = { ok: true } | { ok: false; error: string };

/** Comprueba correo y contraseña y, si son correctos, abre la sesión. */
export async function login(emailInput: string, password: string): Promise<LoginResult> {
  const cfg = config();
  if (!cfg) return { ok: false, error: "El panel no está configurado." };

  const email = emailInput.trim().toLowerCase();
  const ipKey = `ip:${await clientIp()}`;
  const emailKey = `email:${email}`;
  if (isLimited(ipKey) || isLimited(emailKey)) {
    await wait(1000);
    return { ok: false, error: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." };
  }

  const validInput = email.length <= 200 && password.length > 0 && password.length <= 200;
  // Siempre se calcula la huella para que la respuesta tarde lo mismo con correo correcto o no.
  const passwordOk = validInput ? await verifyPassword(password, cfg.passwordHash) : false;
  const emailOk = validInput && safeEqualText(email, cfg.email);

  if (!passwordOk || !emailOk) {
    registerFailure(ipKey);
    registerFailure(emailKey);
    await wait(800 + Math.floor(Math.random() * 400));
    return { ok: false, error: "Correo o contraseña incorrectos." };
  }

  attempts.delete(ipKey);
  attempts.delete(emailKey);
  (await cookies()).set(COOKIE_NAME, createToken(cfg.email, cfg.sessionSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return { ok: true };
}

export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
}

export type AdminSession = { email: string };

/** Devuelve el administrador con sesión activa, o null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cfg = config();
  if (!cfg) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const email = token ? readToken(token, cfg) : null;
  return email ? { email } : null;
}

/** Para acciones del servidor: lanza un error si no hay un administrador con sesión. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdminSession();
  if (!admin) throw new Error("No autorizado.");
  return admin;
}
