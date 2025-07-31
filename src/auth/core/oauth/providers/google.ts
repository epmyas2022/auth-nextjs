import { Environment } from "@/shared/enviroment";
import { Cookies } from "../../session";
import { OAuthClient } from "../oauth.client";
import z from "zod";

export default function GoogleProvider(cookies: Cookies) {
  return new OAuthClient(cookies, {
    provider: "google",
    clientId: Environment.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: Environment.OAUTH_GOOGLE_CLIENT_SECRET,
    urls: {
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    response: {
      tokenType: "Bearer",
      tokenKey: "access_token",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(),
        name: z.string(),
        email: z.email(),
        picture: z.url().nullable(),
      }),
      parser: (user) => {
        return {
          id: user.sub,
          name: user.name,
          email: user.email,
          login: user.email.split("@")[0],
        };
      },
    },
    scopes: ["openid", "profile", "email"],
  });
}
