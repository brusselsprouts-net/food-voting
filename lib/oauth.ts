import { createGoogleOAuthConfig } from "deno_kv_oauth/mod.ts";

export const OAUTH_CONFIG = createGoogleOAuthConfig({
  redirectUri: "http://localhost:8000/oauth/callback",
  scope: [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
});

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
