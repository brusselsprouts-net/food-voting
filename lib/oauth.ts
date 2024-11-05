import { createGoogleOAuthConfig, getRequiredEnv } from "deno_kv_oauth/mod.ts";

export function createOauthConfig() {
  return createGoogleOAuthConfig({
    redirectUri: new URL("/oauth/callback", getRequiredEnv("ORIGIN"))
      .toString(),
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
}

export interface Authentication {
  session_id: string;
  user_info: UserInfo;
}

export interface UserInfo {
  /** User ID */
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  /** URL to the user's profile photo */
  picture: string;
  email: string;
  email_verified: boolean;
}
