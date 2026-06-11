import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function firstPresentEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

const githubClientId = firstPresentEnv("AUTH_GITHUB_ID", "GITHUB_ID");
const githubClientSecret = firstPresentEnv(
  "AUTH_GITHUB_SECRET",
  "GITHUB_SECRET",
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: firstPresentEnv("AUTH_SECRET", "NEXTAUTH_SECRET"),
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
