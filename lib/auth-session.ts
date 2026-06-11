import { auth } from "@/auth";
import { AuthenticationError } from "@/lib/auth-errors";

export async function getCurrentUserId() {
  const session = await auth();

  return session?.user?.id ?? null;
}

export async function requireApiUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new AuthenticationError();
  }

  return userId;
}
