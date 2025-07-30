import db from "@/db";
import { revoke, signer, UserSession, verifier } from "./jwt";
import { Environment } from "@/shared/enviroment";
import { eq } from "drizzle-orm";
import { UserTable } from "@/db/schema";
import { redirect } from "next/navigation";

const COOKIE_SESSION_KEY = "session-id";

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

function setCookie(id: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, id, {
    secure: Environment.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + Number(Environment.EXPIRED_SESSION) * 1000,
  });
}

export const createSession = (
  user: UserSession,
  cookies: Pick<Cookies, "set">
) => {
  const token = signer(user);

  setCookie(token, cookies);
};

export const getSession = async (
  cookies: Pick<Cookies, "get">
): Promise<UserSession | null> => {
  const cookie = cookies.get(COOKIE_SESSION_KEY);
  if (!cookie) return null;

  const session = await verifier(cookie.value);

  return session;
};

const getUser = async (id: number) => {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });
  return user ?? null;
};

export type User = Exclude<
  Awaited<ReturnType<typeof getUser>>,
  undefined | null
>;

export const getUserBySession = async (
  cookies: Pick<Cookies, "get">,
  redirectIfNotFound: boolean = false
): Promise<User | null> => {
  const session = await getSession(cookies);
  if (!session) return null;

  const user = await getUser(session.id);

  if (!user && redirectIfNotFound) {
    return redirect("/sign-in");
  }

  return user;
};

export const removeSession = async (
  cookies: Pick<Cookies, "delete" | "get">
) => {
  const cookie = cookies.get(COOKIE_SESSION_KEY);

  if (!cookie) return null;

  await revoke(cookie.value);

  cookies.delete(COOKIE_SESSION_KEY);
};
