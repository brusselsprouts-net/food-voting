import { defineRoute } from "$fresh/server.ts";
import { Authentication } from "$lib/oauth.ts";
import Header from "$components/Header.tsx";
import { Head } from "$fresh/runtime.ts";

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
      <Head>
        <link rel="stylesheet" href="index.css" />
      </Head>
      {ctx.state !== undefined && <Header user_info={ctx.state.user_info} />}
      <div class="welcome_container">
        <h1>
          <span>W</span>
          <span>E</span>
          <span>L</span>
          <span>C</span>
          <span>O</span>
          <span>M</span>
          <span>E</span>
        </h1>
        <h1>
          to the Brussel Sprouts
          <br />
          weekly dinner
          <br />
          voting system
        </h1>
        {signed_in || (
          <a href={sign_in_route.toString()} class="sign-in-button">
            Sign In
          </a>
        )}
      </div>
    </>
  );
});
