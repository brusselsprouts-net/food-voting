import Place from "$components/Place.tsx";
import { RESTAURANT_ENTRIES, RestaurantsVote } from "$lib/restaurants.ts";
import { defineRoute } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { current_week, next_thursday } from "$lib/week.ts";

export default defineRoute<State>(async (_req, ctx) => {
  const kv = await Deno.openKv();

  const week = current_week();
  const previous_vote = (await kv.get<RestaurantsVote>(
    ["votes", week.year, week.number, ctx.state.user_info.sub],
  )).value;

  const today = Temporal.Now.plainDateISO();
  const thursday = next_thursday(today);

  return (
    <>
      <h1>Welcome {ctx.state.user_info.name}</h1>
      <p>
        Make your vote {new Intl.RelativeTimeFormat("en-GB").format(
          today.until(thursday).days,
          "days",
        )} for {new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
          thursday,
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
      <form action="/api/votes" method="post" class="suggestion_form">
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
