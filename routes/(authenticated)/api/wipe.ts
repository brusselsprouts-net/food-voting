import { Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
    async POST(req, ctx) {
        if (await req.text() !== "with tp") {
            return Response.error();
        }

        const kv = await Deno.openKv();

        for await (const entry of kv.list({ prefix: [] })) {
            await kv.delete(entry.key);
        }

        return new Response();
    },
};
