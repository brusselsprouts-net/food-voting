// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_authenticated_middleware from "./routes/(authenticated)/_middleware.ts";
import * as $_authenticated_stats from "./routes/(authenticated)/stats.tsx";
import * as $_authenticated_vote from "./routes/(authenticated)/vote.tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $index from "./routes/index.tsx";
import * as $oauth_callback from "./routes/oauth/callback.ts";
import * as $oauth_signin from "./routes/oauth/signin.ts";
import * as $oauth_signout from "./routes/oauth/signout.ts";

import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/(authenticated)/_middleware.ts": $_authenticated_middleware,
    "./routes/(authenticated)/stats.tsx": $_authenticated_stats,
    "./routes/(authenticated)/vote.tsx": $_authenticated_vote,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/index.tsx": $index,
    "./routes/oauth/callback.ts": $oauth_callback,
    "./routes/oauth/signin.ts": $oauth_signin,
    "./routes/oauth/signout.ts": $oauth_signout,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
