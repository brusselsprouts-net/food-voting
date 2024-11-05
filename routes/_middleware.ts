import { FreshContext } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { Authentication, UserInfo } from "$lib/oauth.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<Authentication | undefined>,
) {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  const session_id = await getSessionId(req);

  if (session_id != undefined) {
    const kv = await Deno.openKv();
    const user_info = await kv.get<UserInfo>(["user-session", session_id]);

    ctx.state = {
      session_id,
      user_info: user_info.value!,
    };
    return await ctx.next();
  }

  ctx.state = undefined;
  return await ctx.next();
}
