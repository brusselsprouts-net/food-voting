import { Handlers } from "$fresh/server.ts";
import { handleCallback } from "deno_kv_oauth/mod.ts";
import { OAUTH_CONFIG } from "$lib/oauth.ts";

export const handler: Handlers = {
    async GET(req) {
        const { response, sessionId, tokens } = await handleCallback(
            req,
            OAUTH_CONFIG,
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
        const openid_configuration = await openid_response.json();
        console.log(openid_configuration);

        const userinfo_response = await fetch(
            openid_configuration["userinfo_endpoint"],
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
        const userinfo = await userinfo_response.json();

        console.log(userinfo);

        const kv = await Deno.openKv();
        kv.set(["user-info", sessionId], userinfo, {
            expireIn: (tokens.expiresIn ?? 7776000) * 1000,
        });

        return response;
    },
};