
import { int, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamps = {
  updated_at: text().default(sql`(CURRENT_TIMESTAMP)`),
  created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
  deleted_at: text(),
}
export const UserTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  email: text().notNull().unique(),
  password: text(),
  ...timestamps,
});

export const OAuthTable = sqliteTable("oauth", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull(),
  provider: text().notNull(),
  providerAccountId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  ...timestamps,
});


export const RevokedTokensTable = sqliteTable("revoked_tokens", {
  id: int().primaryKey({ autoIncrement: true }),
  token: text().notNull(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});