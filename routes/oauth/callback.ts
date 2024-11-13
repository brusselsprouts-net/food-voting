import { Handlers } from "$fresh/server.ts";
import { handleCallback } from "deno_kv_oauth/mod.ts";
import { createOauthConfig, UserInfo } from "$lib/oauth.ts";
import { create_user_session } from "$lib/kv.ts";
import { z } from "zod";
import { OAuth2ResponseError } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";

const OpenIdConfiguration = z.object({
  userinfo_endpoint: z.string().url(),
});

export const handler: Handlers = {
  async GET(req) {
    const callback_response = await handleCallback(
      req,
      createOauthConfig(),
    ).then((success) => ({ ok: true as const, data: success })).catch(
      (error) => {
        // TODO: user feedback of some sort
        if (error instanceof OAuth2ResponseError) {
          console.log("oauth response error", error);
        } else {
          console.warn(error);
        }

        return {
          ok: false as const,
          error: new Response(null, {
            headers: { location: "/" },
            status: 307,
          }),
        };
      },
    );

    if (!callback_response.ok) {
      return callback_response.error;
    }

    const { response, sessionId: session_id, tokens } = callback_response.data;

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
