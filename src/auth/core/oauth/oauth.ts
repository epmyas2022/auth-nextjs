
import { Cookies } from "../session";
import InvalidStateException from "./exceptions/invalid-state.exception";
import InvalidCodeException from "./exceptions/invalid-code.exception";
import crypto from "crypto";

export const COOKIES_KEYS = {
  STATE: "oauth_state",
  CODE_VERIFIER: "oauth_code_verifier",
};

export const COOKIE_EXPIRATION_SECONDS = 60 * 10; // 10 minutes

export class OAuthActions {
  constructor(private cookies: Pick<Cookies, "set" | "get">) {}

  public generateRandomId(): string {
    return crypto.randomBytes(64).toString("hex").normalize();
  }

  createState(): string {
    const state = this.generateRandomId();
    this.cookies.set(COOKIES_KEYS.STATE, state, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000, // 10 minutes
    });
    return state;
  }

  createCodeVerifier(): string {
    const codeVerifier = this.generateRandomId();
    this.cookies.set(COOKIES_KEYS.CODE_VERIFIER, codeVerifier, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000, // 10 minutes
    });
    return codeVerifier;
  }

  verifyState(state: string): string {
    const storedState = this.cookies.get(COOKIES_KEYS.STATE)?.value;
    if (storedState !== state) throw new InvalidStateException();
    return storedState;
  }

  getCodeVerifier(): string  {
    const codeVerifier = this.cookies.get(COOKIES_KEYS.CODE_VERIFIER)?.value;
    if (!codeVerifier) throw new InvalidCodeException();
    return codeVerifier;
  }
}
