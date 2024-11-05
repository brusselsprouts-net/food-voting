import { FreshContext } from "$fresh/server.ts";
import { Authentication } from "$lib/oauth.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<Authentication | undefined>,
) {
  if (ctx.state === undefined) {
    const request_url = new URL(req.url);

    const url = new URL("/", request_url);
    url.searchParams.append("return_to", request_url.pathname);

    return new Response(null, {
      headers: {
        location: url.toString(),
      },
      status: 302,
      statusText: "Found",
    });
  }

  return await ctx.next();
}
