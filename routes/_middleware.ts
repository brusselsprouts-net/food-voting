import { FreshContext } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { Authentication } from "$lib/oauth.ts";
import { user_session } from "$lib/kv.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<Authentication | undefined>,
) {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  const session_id = await getSessionId(req);

  if (session_id === undefined) {
    ctx.state = undefined;
    return await ctx.next();
  }

  const user_info = await user_session(session_id);

  if (user_info === undefined) {
    ctx.state = undefined;
    return await ctx.next();
  }

  ctx.state = {
    session_id,
    user_info: user_info,
  };
  return await ctx.next();
}
