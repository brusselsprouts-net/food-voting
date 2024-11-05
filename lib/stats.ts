import { entriesTyped } from "$lib/object.ts";
import { RestaurantsKey, RestaurantsVote } from "$lib/restaurants.ts";
import { Week } from "$lib/week.ts";
import { UserInfo } from "$lib/oauth.ts";

export async function calculate_stats(week: Week) {
  const kv = await Deno.openKv();

  const votes = kv.list<RestaurantsVote>({
    prefix: ["votes", week.year, week.number],
  });

  const all_users = await Array.fromAsync(kv.list<UserInfo>({
    prefix: ["user-info"],
  }));

  const summary = new Map<
    RestaurantsKey,
    { negative: number; positive: number }
  >();

  const users = [];
  let vote_count = 0;
  for await (const vote of votes) {
    vote_count += 1;

    const user_id = vote.key.at(-1)!.toString();
    const user = all_users.find(({ value }) => {
      return value.sub === user_id;
    })!.value;
    users.push(user);

    for (const [restaurant, rank] of entriesTyped(vote.value)) {
      let { negative, positive } = summary.get(restaurant) ??
        { negative: 0, positive: 0 };

      if (rank === "positive") {
        positive += 1;
      } else if (rank === "negative") {
        negative += 1;
      }

      summary.set(restaurant, { negative, positive });
    }
  }

  return { summary, votes: vote_count, users };
}

export function score(
  summary: { negative: number; positive: number },
): number {
  return summary.positive - summary.negative;
}
