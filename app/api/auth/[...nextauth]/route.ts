import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"

// Hardcoded credentials for testing
const HARDCODED_USERS = [
  {
    id: "1",
    email: "admin@dayora.com",
    password: "admin123",
    name: "Admin User"
  },
  {
    id: "2", 
    email: "user@dayora.com",
    password: "user123",
    name: "Test User"
  },
  {
    id: "3",
    email: "demo@dayora.com", 
    password: "demo123",
    name: "Demo User"
  }
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
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        // Check against hardcoded users first
        const hardcodedUser = HARDCODED_USERS.find(
          user => user.email === credentials.email && user.password === credentials.password
        )

        if (hardcodedUser) {
          return {
            id: hardcodedUser.id,
            email: hardcodedUser.email,
            name: hardcodedUser.name,
          }
        }

        // Fallback: try to find/create user in database (without bcrypt for now)
        try {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (user) {
            // For existing users, just return them (skip password check for now)
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
            }
          } else {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                emailVerified: new Date(),
              },
            })
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
            }
          }
        } catch (error) {
          console.error('Database error during auth:', error)
          // If database fails, still allow hardcoded users
          return null
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