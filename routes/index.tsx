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

  const random_button = Math.round(Math.random()*6+1);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="index.css" />
      </Head>
      {ctx.state !== undefined && <Header user_info={ctx.state.user_info} />}
      <div class="welcome_container">
        <div class="welcome">
          <span class="shape shape-1">W</span>
          <span class="shape shape-2">E</span>
          <span class="shape shape-3">L</span>
          <span class="shape shape-4">C</span>
          <span class="shape shape-5">O</span>
          <span class="shape shape-6">M</span>
          <span class="shape shape-7">E</span>
        </div>
        <div class="subtitle">
          <div>to the Brussel Sprouts</div>
          <div>weekly dinner</div>
          <div>voting system</div>
        </div>
        {signed_in || (
          <a href={sign_in_route.toString()} class={`sign-in-button shape shape-${random_button}`}>
            Sign In
          </a>
        )}
      </div>
    </>
  );
});
