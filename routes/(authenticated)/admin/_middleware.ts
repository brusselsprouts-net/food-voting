import { FreshContext } from "$fresh/server.ts";
import { Authentication } from "$lib/oauth.ts";

export async function handler(
  _req: Request,
  ctx: FreshContext<Authentication>,
) {
  // Zach only
  if (ctx.state.user_info.sub !== "105829280734903444202") {
    return ctx.renderNotFound();
  }

  return await ctx.next();
}
