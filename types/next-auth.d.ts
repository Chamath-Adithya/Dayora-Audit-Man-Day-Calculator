import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the user's ID and role.
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
  }
}
