import { FreshContext } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { UserInfo } from "$lib/oauth.ts";

export interface State {
  session_id: string;
  user_info: UserInfo;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
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

  const redirect = encodeURIComponent(new URL(req.url).pathname);

  return new Response(
    `Unauthorized, please <a href="/oauth/signin/?success_url=${redirect}">sign in</a>`,
    {
      status: 401,
      headers: { "content-type": "text/html" },
    },
  );
}
