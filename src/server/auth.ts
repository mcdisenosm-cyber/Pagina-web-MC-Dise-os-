import "server-only";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Inicio de sesión del panel /admin con Google (Auth.js / next-auth).
 *
 * - Google gestiona la contraseña y la verificación en dos pasos; la web nunca la ve.
 * - Solo entran los correos de ADMIN_EMAILS (variable secreta del servidor, separada
 *   por comas) y únicamente si Google confirma que el correo está verificado.
 * - La sesión vive en una cookie cifrada, httpOnly y con duración limitada.
 */

const SESSION_HOURS = 8;

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email) && adminEmails().includes(email!.toLowerCase());
}

/** El panel funciona solo si están todas las variables necesarias. */
export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET &&
      adminEmails().length > 0,
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Pide siempre elegir la cuenta para evitar entrar con otra por error.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_HOURS * 60 * 60 },
  pages: { signIn: "/admin", error: "/admin" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const googleProfile = profile as { email?: string; email_verified?: boolean } | undefined;
      return googleProfile?.email_verified === true && isAdminEmail(googleProfile.email);
    },
    async jwt({ token }) {
      // Si un correo deja de estar autorizado, su sesión deja de valer de inmediato.
      token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    async session({ session, token }) {
      return { ...session, isAdmin: token.isAdmin === true };
    },
  },
};

export type AdminSession = { email: string; name: string | null; image: string | null };

/** Devuelve el administrador con sesión activa, o null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isAdminConfigured()) return null;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) return null;
  return { email, name: session.user?.name ?? null, image: session.user?.image ?? null };
}

/** Para acciones del servidor: lanza un error si no hay un administrador con sesión. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdminSession();
  if (!admin) throw new Error("No autorizado.");
  return admin;
}
