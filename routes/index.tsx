import { defineRoute } from "$fresh/server.ts";
import { Authentication } from "$lib/oauth.ts";

export default defineRoute<Authentication | undefined>((req, ctx) => {
  const request_url = new URL(req.url);
  const return_to = request_url.searchParams.get("return_to");

  const sign_in_route = new URL("/oauth/signin", request_url);
  if (return_to !== null) {
    sign_in_route.searchParams.set("success_url", return_to);
  }

  const sign_out_route = new URL("/oauth/signout", request_url);
  sign_out_route.searchParams.set("success_url", request_url.pathname);

  const signed_in = ctx.state !== undefined;

  // TODO: separate components for the logged in and not logged in page

  return (
    <>
      <h1>Welcome</h1>
      <nav>
        {signed_in || (
          <li>
            <a href={sign_in_route.toString()}>Sign In</a>
          </li>
        )}
        {signed_in && (
          <li>
            <a href={sign_out_route.toString()}>Sign Out</a>
          </li>
        )}
        {signed_in && (
          <li>
            <a href="/stats">Stats</a>
          </li>
        )}
        {signed_in && (
          <li>
            <a href="/vote">Vote</a>
          </li>
        )}
      </nav>
    </>
  );
});
