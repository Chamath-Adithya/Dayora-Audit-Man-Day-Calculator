import NextAuth from "next-auth"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"

const HARDCODED_USERS = [
  {
    id: "clxvxkx4p0000u8z5d4f6e8k9",
    email: "admin@dayora.com",
    password: "admin123",
    name: "Admin User",
    role: "admin"
  },
  {
    id: "clxvxkx4p0001u8z5d4f6e8k0",
    email: "user@dayora.com",
    password: "user123",
    name: "Regular User",
    role: "user"
  },
  {
    id: "clxvxkx4p0002u8z5d4f6e8k1",
    email: "demo@dayora.com",
    password: "demo123",
    name: "Demo User",
    role: "user"
  },
]

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

        const user = HARDCODED_USERS.find(
          (user) => user.email === credentials.email && user.password === credentials.password
        );

        if (user) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } else {
          return null;
        }
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
    async session({ session, token }: any) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
