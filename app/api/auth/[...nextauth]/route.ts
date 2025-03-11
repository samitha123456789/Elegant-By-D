// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user || !bcrypt.compareSync(credentials?.password || "", user.password)) {
          throw new Error("Invalid email or password");
        }
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as "customer" | "admin";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "customer" | "admin";
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required, no fallback
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };