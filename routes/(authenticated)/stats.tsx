import { getRestaurantName, RestaurantsVote } from "$lib/restaurants.ts";
import { calculate_stats, score } from "$lib/stats.ts";
import Header from "$components/Header.tsx";
import { defineRoute } from "$fresh/src/server/defines.ts";
import { Authentication } from "$lib/oauth.ts";
import { Head } from "$fresh/runtime.ts";
import { Week } from "$lib/week.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { set_vote, weeks_exist } from "$lib/kv.ts";

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
    if (
      req.headers.get("content-type") !== "application/x-www-form-urlencoded"
    ) {
      return await ctx.render();
    }

    const form_data = await req.formData();
    const entries = RestaurantsVote.safeParse(new Map(form_data.entries()));

    if (!entries.success) {
      return new Response(entries.error.toString(), {
        status: 400,
      });
    }

    const week = Week.current();

    set_vote(week, ctx.state.user_info, entries.data);

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

  const { summary, votes, voted_users } = await calculate_stats(week);

  const sorted = summary.entries().toArray().sort(
    ([_a, a], [_b, b]) => {
      return score(b) - score(a);
    },
  );

  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" });

  const previous = week.previous();
  const next = week.next();

  const [previous_exists, next_exists] = await weeks_exist([previous, next]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/stats.css" />
      </Head>
      <Header user_info={ctx.state.user_info} />

      <div class="weeks">
        <a
          class="previous"
          href={previous_exists
            ? `/stats/${previous.year}/wk${previous.number}`
            : undefined}
          aria-disabled={!previous_exists}
        >
          {formatter.format(previous.date)}
        </a>
        <span class="current">
          <span class="week">Week {week.number}, {week.year}</span>
          <span class="sub">{formatter.format(week.date)}</span>
        </span>
        <a
          class="next"
          href={next_exists
            ? `/stats/${next.year}/wk${next.number}`
            : undefined}
        >
          {formatter.format(next.date)}
        </a>
      </div>

      <p>{votes} total vote(s) are in!</p>
      <ul>{voted_users.map((x) => <li>{x.name}</li>)}</ul>
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
