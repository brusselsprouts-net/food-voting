import { createGoogleOAuthConfig, getRequiredEnv } from "deno_kv_oauth/mod.ts";
import { z } from "zod";

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
  user_info: UserInfoType;
}

export type UserInfoType = z.infer<typeof UserInfo>;
export const UserInfo = z.object({
  /** User ID */
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),

  /** URL to the user's profile photo */
  picture: z.string().url(),

  email: z.string().email(),
  email_verified: z.boolean(),
});
