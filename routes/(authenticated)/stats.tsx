import { getRestaurantName } from "$lib/restaurants.ts";
import { calculate_stats, score } from "$lib/stats.ts";
import Header from "$components/Header.tsx";
import { defineRoute } from "$fresh/src/server/defines.ts";
import { Authentication } from "$lib/oauth.ts";
import { Head } from "$fresh/runtime.ts";
import { Week } from "$lib/week.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/stats{/:year}?{/wk:week}?",
};

export const handler: Handlers<null, Authentication> = {
  GET(req, ctx) {
    const year = ctx.params["year"];
    const week = ctx.params["week"];

    if (year.length === 0 && week.length === 0) {
      const week = Week.current();

      return Response.redirect(
        new URL(`/stats/${week.year}/wk${week.number}`, req.url),
        302,
      );
    }

    return ctx.render();
  },
  async POST(req, ctx) {
    const kv = await Deno.openKv();

    if (
      req.headers.get("content-type") !== "application/x-www-form-urlencoded"
    ) {
      return await ctx.render();
    }

    const form_data = await req.formData();
    const entries = Object.fromEntries(form_data.entries());

    const week = Week.current();

    await kv.set(
      ["votes", week.year, week.number, ctx.state.user_info.sub], // TODO: do we store historical data like this?
      entries,
    );

    return Response.redirect(req.url, 302);
  },
};

export default defineRoute<Authentication>(async (_req, ctx) => {
  const week = (() => {
    const year = ctx.params["year"];
    const week = ctx.params["week"];

    return Week.from_week_nr(
      parseInt(year),
      parseInt(week),
    );
  })();

  const { summary, votes, users } = await calculate_stats(week);

  const sorted = summary.entries().toArray().sort(
    ([_a, a], [_b, b]) => {
      return score(b) - score(a);
    },
  );

  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" });

  // TODO: filter by and check if these are in the kv store
  const previous = week.previous();
  const next = week.next();

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/stats.css" />
      </Head>
      <Header user_info={ctx.state.user_info} />

      <div class="weeks">
        <a
          class="previous"
          href={`/stats/${previous.year}/wk${previous.number}`}
        >
          {formatter.format(previous.date)}
        </a>
        <span class="current">
          <span class="week">Week {week.number}, {week.year}</span>
          <span class="sub">{formatter.format(week.date)}</span>
        </span>
        <a
          class="next"
          href={next.further_than_next_week()
            ? undefined
            : `/stats/${next.year}/wk${next.number}`}
        >
          {formatter.format(next.date)}
        </a>
      </div>

      <p>{votes} total vote(s) are in!</p>
      <ul>{users.map((x) => <li>{x.name}</li>)}</ul>
      <ol class="chart">
        {sorted.map(([key, { negative, positive }]) => (
          <li>
            <span class="restaurant_name">
              {getRestaurantName(key)}
            </span>
            <span class="bars" style={{ "--total-votes": votes }}>
              <span
                class="negative"
                style={{ "--count": negative }}
              >
                {negative}
              </span>
              <span
                class="positive"
                style={{ "--count": positive }}
              >
                {positive}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
});
