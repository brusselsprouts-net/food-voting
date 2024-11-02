import { entriesTyped } from "./object.ts";
import { RestaurantsKey, RestaurantsVote } from "./restaurants.ts";

export async function calculate_stats() {
    const kv = await Deno.openKv();

    const votes = kv.list<RestaurantsVote>({ prefix: ["votes"] });

    const summary = new Map<RestaurantsKey, [number, number]>();

    for await (const vote of votes) {
        for (const [restaurant, rank] of entriesTyped(vote.value)) {
            let [detract, promote] = summary.get(restaurant) ?? [0, 0];

            if (rank === "positive") promote += 1;
            else if (rank === "negative") detract -= 1;

            summary.set(restaurant, [detract, promote]);
        }
    }

    return summary;
}
