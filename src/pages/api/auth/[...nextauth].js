// this file is the main entry point that allows next-auth to be in the app

import NextAuth from "next-auth/next";
import prisma from "../../../../libs/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "moesuo" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "Mohamed" },
      },
      async authorize(credentials) {
        // Check if email and password are provided
        if (!credentials.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        }

        // Check if user exists in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If no user was found
        if (!user || !user.hashedPassword) {
          throw new Error("No user found");
        }

        // Check if password matches
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // If password does not match
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return user;
      },
      pages: {
        signIn: "/user/login",
        resetPassword: "/user/resetPassword",
      },
    }),
  ],
  secret: process.env.SECRET,
  //to get the  id from the session
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  //to get the  id from the session
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
