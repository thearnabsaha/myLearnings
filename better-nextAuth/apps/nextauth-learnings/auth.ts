import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { prisma } from "@workspace/db/client"
// export const { auth, handlers, signIn, signOut } = NextAuth({
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  ...authConfig,
});

export default handler;