import { Handlers } from "$fresh/server.ts";
import { handleCallback } from "deno_kv_oauth/mod.ts";
import { createOauthConfig, UserInfo } from "$lib/oauth.ts";
import { create_user_session } from "$lib/kv.ts";
import { z } from "zod";

const OpenIdConfiguration = z.object({
  userinfo_endpoint: z.string().url(),
});

export const handler: Handlers = {
  async GET(req) {
    const { response, sessionId: session_id, tokens } = await handleCallback(
      req,
      createOauthConfig(),
    );

    const openid_response = await fetch(
      "https://accounts.google.com/.well-known/openid-configuration",
    );
    if (!openid_response.ok) {
      console.error(
        "unable to fetch google's api routes",
        openid_response,
      );
      return new Response("500 Internal Server Error", { status: 500 });
    }
    const openid_configuration = OpenIdConfiguration.parse(
      await openid_response.json(),
    );

    const userinfo_response = await fetch(
      openid_configuration.userinfo_endpoint,
      {
        headers: {
          authorization: `${tokens.tokenType} ${tokens.accessToken}`,
        },
      },
    );
    if (!userinfo_response.ok) {
      console.error("unable to fetch user's info", userinfo_response);
      return new Response("500 Internal Server Error", { status: 500 });
    }
    const user_info = UserInfo.parse(await userinfo_response.json());

    create_user_session(session_id, user_info);

    return response;
  },
};
