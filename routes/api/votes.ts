import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();

    return Response.json(await Array.fromAsync(kv.list({ prefix: ["votes"] })));
  },
  async POST(req, ctx) {
    const kv = await Deno.openKv();

    const form_data = await req.formData();
    const entries = Object.fromEntries(form_data.entries());

    // const now = Temporal.Now.plainDateISO();

    await kv.set(
      // ["votes", now.yearOfWeek ?? now.year, now.weekOfYear!, "user_id"], // TODO: do we store historical data like this?
      ["votes", "user_id"],
      entries,
    );

    return Response.json(entries);
  },
};

function hasOwnTyped<O extends object, const T extends string>(
  object: O,
  key: T,
): object is O & { [x in T]: unknown } {
  return Object.hasOwn(object, key);
}
