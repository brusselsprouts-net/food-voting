import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async POST(req, ctx) {
    const form_data = await req.formData();
    const entries = new Map(form_data.entries());
    console.log(entries);

    return new Response(
      JSON.stringify(entries, json_extended_replacer),
      { headers: { "content-type": "application/json" } },
    );
  },
};

function json_extended_replacer(_key: string, value: unknown) {
  if (value instanceof Map) {
    return {
      _json_extended_data_type: "Map",
      _json_extended_entries: Object.fromEntries(value.entries()),
    };
  } else {
    return value;
  }
}

function hasOwnTyped<O extends object, const T extends string>(
  object: O,
  key: T,
): object is O & { [x in T]: unknown } {
  return Object.hasOwn(object, key);
}

function json_extended_reviver(key: string, value: unknown) {
  if (typeof value === "object" && value !== null) {
    if (
      hasOwnTyped(value, "_json_extended_data_type") &&
      value._json_extended_data_type === "Map" &&
      hasOwnTyped(value, "_json_extended_entries") &&
      typeof value._json_extended_entries === "object"
    ) {
      if (value._json_extended_entries === null) {
        return null;
      }

      return new Map(Object.entries(value._json_extended_entries));
    }
  }

  return value;
}
