import { FreshContext } from "$fresh/server.ts";
import {
  createGoogleOAuthConfig,
  getSessionId,
  signIn,
} from "deno_kv_oauth/mod.ts";

interface State {
  data: string;
}

const oauth = createGoogleOAuthConfig({
  redirectUri: "http://localhost:8000/auth",
  scope: [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
});

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  if (ctx.destination !== "route") {
    return await ctx.next();
  }

  // FIXME: remove before deploy
  if (
    req.headers.get("X-Auth-Bypass") ===
      "yesindeediambypassingallauthtoperformaverydangerousoperation"
  ) {
    // Ensure LOCALHOST
    if (ctx.remoteAddr.hostname === "127.0.0.1") {
      return await ctx.next();
    }
  }

  const session = await getSessionId(req);

  if (session != undefined) {
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
