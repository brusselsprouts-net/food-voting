import { Week } from "$lib/week.ts";
import { all_users, all_votes } from "$lib/kv.ts";
import { RestaurantsKeyType } from "$lib/restaurants.ts";


export async function calculate_stats(week: Week) {
  const kv = await Deno.openKv();

  const votes = all_votes(week, kv);
  const users = await Array.fromAsync(all_users(kv));

  const summary = new Map<
    RestaurantsKeyType,
    { negative: number; positive: number }
  >();

  const voted_users = [];
  let vote_count = 0;
  for await (const { user_id, vote } of votes) {
    vote_count += 1;

    const user = users.find(({ sub }) => {
      return sub === user_id;
    })!;
    voted_users.push(user);

    for (const [restaurant, rank] of vote.entries()) {
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
