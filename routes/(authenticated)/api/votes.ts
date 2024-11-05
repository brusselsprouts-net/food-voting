import { Handlers } from "$fresh/server.ts";
import { current_week } from "$lib/week.ts";
import { Authentication } from "$lib/oauth.ts";

export const handler: Handlers<null, Authentication> = {
  async GET() {
    const kv = await Deno.openKv();

    return Response.json(await Array.fromAsync(kv.list({ prefix: ["votes"] })));
  },
  async POST(req, ctx) {
    const kv = await Deno.openKv();

    const form_data = await req.formData();
    const entries = Object.fromEntries(form_data.entries());

    const week = current_week();

    await kv.set(
      ["votes", week.year, week.number, ctx.state.user_info.sub], // TODO: do we store historical data like this?
      entries,
    );

    const url = new URL(req.url);
    url.pathname = "/stats";

    return Response.redirect(url); // TODO: put this api route on the stats page and save form values for the client
  },
};
