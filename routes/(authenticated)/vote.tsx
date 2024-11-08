import Place from "$components/Place.tsx";
import { RESTAURANT_ENTRIES } from "$lib/restaurants.ts";
import { defineRoute } from "$fresh/server.ts";
import { Week } from "$lib/week.ts";
import { Authentication } from "$lib/oauth.ts";
import Header from "$components/Header.tsx";
import { Head } from "$fresh/runtime.ts";
import { get_vote } from "$lib/kv.ts";
import MakeYourVote from "$components/MakeYourVote.tsx";

export default defineRoute<Authentication>(async (_req, ctx) => {
  const week = Week.current();
  const previous_vote = await get_vote(week, ctx.state.user_info);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/vote.css" />
      </Head>
      <Header user_info={ctx.state.user_info} />

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
        <MakeYourVote week={week} />

        <input type="reset" />
        <input type="submit" />
        <div class="entries">
          {RESTAURANT_ENTRIES.map(([id, place_name]) => (
            <Place
              name={place_name}
              id={id}
              key={id}
              previous={previous_vote === undefined
                ? undefined
                : previous_vote.get(id)}
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
