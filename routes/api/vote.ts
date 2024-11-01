import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers<null> = {
  async POST(req, ctx) {
    req.formData();

    return Response.error()
  }
}
