import { z } from "zod";
import { Cookies } from "../session";
import { Environment } from "@/shared/enviroment";
import crypto from "crypto";
import { OAuthActions } from "./oauth";

export type OAuthUrls = {
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
};

export type OAuthClientConfig<T> = {
  provider: string;
  urls: OAuthUrls;
  params?: Record<string, unknown>;
  scopes: string[];
  response: {
    tokenKey: string;
    tokenType: string;
  };
  userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => { name: string; login: string; email: string; id: string };
  };
  clientId: string;
  clientSecret: string;
};

export class OAuthClient<T> extends OAuthActions {
  private params: Record<string, unknown> = {};
  constructor(
    cookies: Pick<Cookies, "set" | "get">,
    private readonly config: OAuthClientConfig<T>
  ) {
    super(cookies);
  }

  createAuthorizationUrl(): string {
    const state = this.createState();
    const codeVerifier = this.createCodeVerifier();
    const url = new URL(this.config.urls.authorizationUrl);

    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("scope", this.config.scopes.join(" "));
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("state", state);
    url.searchParams.set(
      "code_challenge",
      crypto.createHash("sha256").update(codeVerifier).digest("base64url")
    );
    url.searchParams.set("code_challenge_method", "S256");

    Object.entries(this.params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    return url.toString();
  }

  async getUserInfo(
    code: string,
    state: string
  ){
    this.verifyState(state);

    const codeVerifier = this.getCodeVerifier();

    const { accessToken } = await this.getAccessToken(code, codeVerifier);

    const response = await fetch(this.config.urls.userInfoUrl, {
      headers: {
        Authorization: `${this.config.response.tokenType} ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user info");

    const data = await response.json();

    return this.config.userInfo.parser(data);
  }

  async getAccessToken(code: string, codeVerifier: string) {
    const response = await fetch(this.config.urls.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.redirectUrl.toString(),
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch access token");

    const data = await response.json();

    const token = data[this.config.response.tokenKey];

    if (!token) throw new Error("Access token not found in response");

    return {
      accessToken: token,
    };
  }

  private get redirectUrl(): URL {
    return new URL(this.config.provider, Environment.OAUTH_REDIRECT_URL_BASE);
  }
}
