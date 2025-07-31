import z from "zod";
import { Cookies } from "../../session";
import { OAuthClient } from "../oauth.client";
import { Environment } from "@/shared/enviroment";

export default function GithubProvider(cookies: Cookies) {
  return new OAuthClient(cookies, {
    provider: "github",
    urls: {
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userInfoUrl: "https://api.github.com/user",
    },
    response: {
      tokenKey: "access_token",
      tokenType: "Bearer",
    },
    scopes: ["user:email", "read:user"],
    clientId: Environment.OAUTH_GITHUB_CLIENT_ID,
    clientSecret: Environment.OAUTH_GITHUB_CLIENT_SECRET,
    userInfo: {
      schema: z.object({
        id: z.number(),
        name: z.string().nullable(),
        login: z.string(),
        email: z.string(),
      }),
      parser: (user) => ({
        id: user.id.toString(),
        name: user?.name ?? user?.login,
        email: user?.email,
        login: user.login,
      }),
    },
  });
};

