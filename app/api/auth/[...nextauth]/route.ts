import NextAuth from "next-auth"
import { prisma } from "@/lib/database"
import CredentialsProvider from "next-auth/providers/credentials"

const HARDCODED_USERS = [
  {
    id: "clxvxkx4p0000u8z5d4f6e8k9", // Replace with a real cuid if needed
    email: "admin@dayora.com",
    password: "admin123",
    name: "Admin User"
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
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        // Check against hardcoded users
        const hardcodedUser = HARDCODED_USERS.find(
          user => user.email === credentials.email && user.password === credentials.password
        )

        if (hardcodedUser) {
          // Ensure the hardcoded user exists in the database
          let userInDb = await prisma.user.findUnique({
            where: { email: hardcodedUser.email },
          });
          if (!userInDb) {
            userInDb = await prisma.user.create({
              data: {
                id: hardcodedUser.id,
                email: hardcodedUser.email,
                name: hardcodedUser.name,
              },
            });
          }
          return userInDb;
        }

        // Fallback to database lookup/creation
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            },
          })
        }

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