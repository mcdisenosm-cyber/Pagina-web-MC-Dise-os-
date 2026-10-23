import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

/** Rutas de inicio y cierre de sesión con Google (/api/auth/...). */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
