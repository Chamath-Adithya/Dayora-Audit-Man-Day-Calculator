import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

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
            return null
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.passwordHash)
          if (isPasswordCorrect) {
            return user
          }
        } else {
          // User does not exist, create a new one
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          try {
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                passwordHash: hashedPassword,
                name: credentials.email.split('@')[0],
                emailVerified: new Date(),
              },
            })
            return newUser
          } catch (error) {
            console.error('Error creating user:', error)
            return null
          }
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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