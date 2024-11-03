import { entriesTyped } from "$lib/object.ts";
import { RestaurantsKey, RestaurantsVote } from "$lib/restaurants.ts";
import { Week } from "$lib/week.ts";
import { UserInfo } from "$lib/oauth.ts";

export async function calculate_stats(week: Week) {
  const kv = await Deno.openKv();

  const votes = kv.list<RestaurantsVote>({
    prefix: ["votes", week.year, week.number],
  });

  const users = await Array.fromAsync(kv.list<UserInfo>({
    prefix: ["user-info"],
  }));

  const summary = new Map<
    RestaurantsKey,
    { negative: UserInfo[]; positive: UserInfo[] }
  >();

  let vote_count = 0;
  for await (const vote of votes) {
    vote_count += 1;

    const user_id = vote.key.at(-1)!.toString();
    const user = users.find(({ value }) => {
      return value.sub === user_id;
    })!.value;

    for (const [restaurant, rank] of entriesTyped(vote.value)) {
      const { negative, positive } = summary.get(restaurant) ??
        { negative: [], positive: [] };

      if (rank === "positive") {
        positive.push(user);
      } else if (rank === "negative") {
        negative.push(user);
      }

      summary.set(restaurant, { negative, positive });
    }
  }

  return { summary, votes: vote_count };
}

export function score(
  summary: { negative: UserInfo[]; positive: UserInfo[] },
): number {
  return summary.positive.length - summary.negative.length;
}
