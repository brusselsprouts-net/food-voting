import { Handlers } from "$fresh/server.ts";
import { signIn } from "deno_kv_oauth/mod.ts";
import { OAUTH_CONFIG } from "$lib/oauth.ts";

export const handler: Handlers = {
  async GET(req) {
    return await signIn(req, OAUTH_CONFIG);
  },
};
