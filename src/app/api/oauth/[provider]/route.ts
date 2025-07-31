import {
  getOAuthClientProvider,
  OAuthProvider,
  oAuthProviders,
} from "@/auth/core/oauth/providers";
import { createSession } from "@/auth/core/session";
import db from "@/db";
import { OAuthTable, UserTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const { provider: providerRaw } = await params;

  const { success, data: provider } = z
    .enum(oAuthProviders)
    .safeParse(providerRaw);

  if (typeof code !== "string" || typeof state !== "string" || !success) {
    return redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Invalid code, state, or provider"
      )}`
    );
  }

  const oAuthClient = getOAuthClientProvider(provider, await cookies());

  const user = await oAuthClient.getUserInfo(code, state);

  try {
    const account = await connectUser(user, provider);

    const { id, name } = account;

    await createSession({ id, name }, await cookies());

  } catch {
    return redirect(
      `/sign-in?oauthError=${encodeURIComponent("Failed to connect user")}`
    );
  }

  return redirect("/");
}

function connectUser(
  {
    id,
    name,
    email,
    login,
  }: {
    id: string;
    name: string;
    email: string;
    login: string;
  },
  provider: OAuthProvider
) {
  if (!email && !login) {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Email or login is required for connection"
      )}`
    );
  }

  return db.transaction(async (tx) => {
    let user = await tx.query.UserTable.findFirst({
      where: or(
        eq(UserTable.email, email || ""),
        eq(UserTable.username, login || "")
      ),
    });

    if (!user) {
      const [newUser] = await tx
        .insert(UserTable)
        .values({
          name,
          email: email || null,
          username: login || null,
        })
        .returning();

      user = newUser;
    }

    await tx
      .insert(OAuthTable)
      .values({
        userId: user.id,
        provider,
        providerAccountId: id
      })
      .onConflictDoNothing();

    return user;
  });
}
