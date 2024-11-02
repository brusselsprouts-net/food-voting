import { Handlers } from "$fresh/server.ts";
import { openKv } from "../../lib/kv.ts";
import { current_week } from "../../lib/week.ts";

export const handler: Handlers<null> = {
  async GET(req, ctx) {
    const kv = await openKv();

    return Response.json(await Array.fromAsync(kv.list({ prefix: ["votes"] })));
  },
  async POST(req, ctx) {
    const kv = await openKv();

    const form_data = await req.formData();
    const user_id = form_data.get("user_id");
    if (user_id instanceof File) {
      console.error("given a file as a user_id");
      return new Response("user_id must not be a file", { status: 400 });
    } else if (user_id === null) {
      console.error("given no user_id");
      return new Response("no user_id given", { status: 400 });
    }

    const entries = Object.fromEntries(
      form_data.entries().filter(([name, _]) => name.startsWith("preference_"))
        .map(([name, value]) => [name.substring("preference_".length), value]),
    );

    const week = current_week();

    await kv.set(
      ["votes", week.year, week.number, user_id], // TODO: do we store historical data like this?
      entries,
    );

    const url = new URL(req.url);
    url.pathname = "/";

    return Response.redirect(url); // TODO: put this api route on the stats page and save form values for the client
  },
};
