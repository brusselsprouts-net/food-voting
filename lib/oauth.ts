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

export type UserIdType = z.infer<typeof UserId>;
export const UserId = z.string();

export type UserInfoType = z.infer<typeof UserInfo>;
export const UserInfo = z.object({
  /** User ID */
  sub: UserId,
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),

  /** URL to the user's profile photo */
  picture: z.string().url().optional(),

  email: z.string().email(),
  email_verified: z.boolean().default(false),
});
