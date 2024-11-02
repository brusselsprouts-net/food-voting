import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async POST(req, ctx) {
    const form_data = await req.formData();
    const entries = Object.fromEntries(form_data.entries());
    console.log(entries);

    return new Response(
      JSON.stringify(entries),
      { headers: { "content-type": "application/json" } },
    );
  },
};

function hasOwnTyped<O extends object, const T extends string>(
  object: O,
  key: T,
): object is O & { [x in T]: unknown } {
  return Object.hasOwn(object, key);
}
