import { Environment } from "@/shared/enviroment";
import jwt from "jsonwebtoken";
import db from "@/db";
import { RevokedTokensTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UserSession = {
  id: number;
  name: string;
};
export const signer = (payload: UserSession): string => {
  const secretKey = Environment.SECRET_KEY;

  return jwt.sign(payload, secretKey, {
    expiresIn: Number(Environment.EXPIRED_SESSION),
  });
};

export const verifier = async (token: string): Promise<UserSession | null> => {
  const secretKey = Environment.SECRET_KEY;

  const tokenExistingRevoked = await db.query.RevokedTokensTable.findFirst({
    where: eq(RevokedTokensTable.token, token),
  });

  if (tokenExistingRevoked) {
    return null;
  }

  return jwt.verify(token, secretKey) as UserSession | null;
};

export const revoke = async (token: string): Promise<void> => {
  const revokedToken = await db.insert(RevokedTokensTable).values({
    token,
  });
  if (!revokedToken) {
    throw new Error("Failed to revoke token");
  }
};
