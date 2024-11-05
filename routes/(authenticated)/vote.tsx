import Place from "$components/Place.tsx";
import { RESTAURANT_ENTRIES, RestaurantsVote } from "$lib/restaurants.ts";
import { defineRoute } from "$fresh/server.ts";
import { Week } from "$lib/week.ts";
import { Authentication } from "$lib/oauth.ts";
import Header from "$components/Header.tsx";
import { Head } from "$fresh/runtime.ts";

export default defineRoute<Authentication>(async (_req, ctx) => {
  const kv = await Deno.openKv();

  const week = Week.current();
  const previous_vote = (await kv.get<RestaurantsVote>(
    ["votes", week.year, week.number, ctx.state.user_info.sub],
  )).value;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/vote.css" />
      </Head>
      <Header user_info={ctx.state.user_info} />
      <h1>Welcome {ctx.state.user_info.name}</h1>
      <p>
        Make your vote {new Intl.RelativeTimeFormat("en-GB").format(
          week.until.days,
          "days",
        )} for {new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
          week.date,
        )}
      </p>
      {
        /* TODO: new place suggestions
      <form>
        <input
          type="text"
          name="suggestion"
          id="suggestion"
          placeholder={"Ribs Factory"}
          style={{ width: "100%" }}
        />
      </form> */
      }
      <form action="/stats" method="post" class="suggestion_form">
        <input type="reset" />
        <input type="submit" />
        <div>
          {RESTAURANT_ENTRIES.map(([id, place_name]) => (
            <Place
              name={place_name}
              id={id}
              key={id}
              previous={previous_vote === null ? undefined : previous_vote[id]}
            >
            </Place>
          ))}
        </div>
        <input type="reset" />
        <input type="submit" />
      </form>
    </>
  );
});
