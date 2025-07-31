import { Cookies } from "../../session";
import GithubProvider from "./github";

export const oAuthProviders = ["discord", "github"] as const;

export type OAuthProvider = (typeof oAuthProviders)[number];


export function getOAuthClientProvider(
  provider: OAuthProvider,
  cookies: Cookies
){
    switch (provider) {
        case "github":
            return GithubProvider(cookies);
        default:
            throw new Error(`Provider ${provider} is not supported`);
    }
}
