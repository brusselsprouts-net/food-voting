import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();

    return Response.json(await Array.fromAsync(kv.list({ prefix: ["votes"] })));
  },
  async POST(req, ctx) {
    const kv = await Deno.openKv();

    const form_data = await req.formData();
    const user_id = form_data.get("user_id");
    if (user_id instanceof File) {
      console.error("given a file as a user_id");
      return new Response("user_id must not be a file", { status: 400 });
    }

    const entries = Object.fromEntries(
      form_data.entries().filter(([name, _]) => name.startsWith("placename_"))
        .map(([name, value]) => [name.substring("placename_".length), value]),
    );

    const now = Temporal.Now.plainDateISO();

    await kv.set(
      ["votes", now.yearOfWeek ?? now.year, now.weekOfYear!, "user_id"], // TODO: do we store historical data like this?
      // ["votes", user_id],
      entries,
    );

    const url = new URL(req.url);
    url.pathname = "/";

    return Response.redirect(url);
  },
};
