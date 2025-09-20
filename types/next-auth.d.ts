import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the user's ID.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
  }
}
