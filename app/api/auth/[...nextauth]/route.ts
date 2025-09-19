import NextAuth from "next-auth"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@dayora.com" },
        password: { label: "Password", type: "password", placeholder: "admin123" }
      },
      async authorize(credentials, req) {
        console.log("Authorize function called");
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          console.log("User not found, creating new user");
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            },
          })
        }
        console.log("Authorize function returning user:", user);
        return user
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
      console.log("Session callback called, token:", token);
      if (token.sub) {
        session.user.id = token.sub;
      }
      console.log("Session callback returning session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback called, user:", user);
      if (user) {
        token.sub = user.id;
      }
      console.log("JWT callback returning token:", token);
      return token;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }