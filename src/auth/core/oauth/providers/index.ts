import { Cookies } from "../../session";
import GithubProvider from "./github";
import GoogleProvider from "./google";

export const oAuthProviders = ["google", "github"] as const;

export type OAuthProvider = (typeof oAuthProviders)[number];


export function getOAuthClientProvider(
  provider: OAuthProvider,
  cookies: Cookies
){
    switch (provider) {
        case "github":
            return GithubProvider(cookies);
        case "google":
            return GoogleProvider(cookies);
        default:
            throw new Error(`Provider ${provider} is not supported`);
    }
}
