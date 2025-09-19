import NextAuth from "next-auth"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@dayora.com" },
        password: { label: "Password", type: "password", placeholder: "admin123" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user && user.passwordHash) {
          console.log("Attempting to log in user:", credentials.email);
          console.log("Provided password:", credentials.password);
          console.log("Stored hash:", user.passwordHash);
          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
          console.log("Password comparison result:", isValidPassword);
          if (isValidPassword) {
            return { id: user.id, name: user.name, email: user.email };
          }
        }
        console.log("Authentication failed for user:", credentials.email);
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }