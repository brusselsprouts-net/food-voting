import { openKv } from "./kv.ts";
import { entriesTyped } from "./object.ts";
import { RestaurantsKey, RestaurantsVote } from "./restaurants.ts";
import { Week } from "./week.ts";

export async function calculate_stats(week: Week) {
    const kv = await openKv();

    const votes = kv.list<RestaurantsVote>({
        prefix: ["votes", week.year, week.number],
    });

    const summary = new Map<
        RestaurantsKey,
        { negative: string[]; positive: string[] }
    >();

    let vote_count = 0;
    for await (const vote of votes) {
        vote_count += 1;

        for (const [restaurant, rank] of entriesTyped(vote.value)) {
            const { negative, positive } = summary.get(restaurant) ??
                { negative: [], positive: [] };

            if (rank === "positive") positive.push(vote.key.at(-1)!.toString());
            else if (rank === "negative") {
                negative.push(vote.key.at(-1)!.toString());
            }

            summary.set(restaurant, { negative, positive });
        }
    }

    return { summary, votes: vote_count };
}

export function score(
    summary: { negative: string[]; positive: string[] },
): number {
    return summary.positive.length - summary.negative.length;
}
