import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user) {
          // User exists, compare password
          if (!user.passwordHash) {
            // This user was likely created without a passwordHash (e.g., via OAuth before this change)
            // For now, we'll treat this as an invalid login. In a real app, you might prompt for password setup.
            return null
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.passwordHash)
          if (isPasswordCorrect) {
            return user
          }
        } else {
          // User does not exist, create a new one
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              passwordHash: hashedPassword,
              name: credentials.email.split('@')[0], // Basic name from email
              emailVerified: new Date(), // Mark as verified on creation
            },
          })
          return newUser
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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