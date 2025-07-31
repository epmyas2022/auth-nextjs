"use server";
import { z } from "zod";
import { signUpSchema, signInSchema } from "../schemas/auth.schema";
import messages from "./messages";
import db from "@/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/db/schema";
import { redirect } from "next/navigation";
import { getSalt, hashPassword, verifyPassword } from "@/auth/core/hasher";
import { cookies } from "next/headers";
import { createSession, removeSession } from "@/auth/core/session";
import { getOAuthClientProvider, OAuthProvider } from "@/auth/core/oauth/providers";

export async function signUpAction(unsafeDate: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeDate);

  if (!success) return messages.SIGNUP.ERROR;

  const userExisting = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (userExisting) {
    return messages.SIGNUP.EXIST_ACCOUNT;
  }

  try {
    const salt = getSalt();

    const passwordSafe = await hashPassword(data.password, salt);

    const newUser = await db
      .insert(UserTable)
      .values({
        name: data.name,
        email: data.email,
        password: passwordSafe,
      })
      .returning({
        id: UserTable.id,
        name: UserTable.name,
      })
      .get();

    const { id, name } = newUser;

    await createSession({ id, name }, await cookies());
  } catch {
    return messages.SIGNUP.ERROR;
  }

  redirect("/");
}

export async function signInAction(unsafeData: z.infer<typeof signInAction>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return messages.SIGNIN.ERROR;

  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (!user) return messages.SIGNIN.ERROR;

  if (
    !user.password ||
    !user.name ||
    !verifyPassword(data.password, user.password)
  ) {
    return messages.SIGNIN.ERROR;
  }

  const { id, name } = user;

  await createSession({ id, name }, await cookies());

  redirect("/");
}

export async function signOutAction() {
  await removeSession(await cookies());

  redirect("/");
}

export async function oAuthSignInAction(provider: OAuthProvider) {
  const oAuthClient = getOAuthClientProvider(provider, await cookies());

  redirect(oAuthClient.createAuthorizationUrl());
}
