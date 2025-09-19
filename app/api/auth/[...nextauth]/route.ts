import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@dayora.com" },
        password: { label: "Password", type: "password", placeholder: "admin123" }
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        // This is a simplified authorization for demonstration.
        // In a real application, you should hash and compare passwords.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user) {
          // For now, we'll just check if the user exists.
          // Replace this with actual password validation.
          return user
        } else {
          // In a real app, you might want to throw an error or return null
          // depending on your registration strategy.
          return null
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  session: {
    strategy: "database" as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }