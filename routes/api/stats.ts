import { Handlers } from "$fresh/server.ts";
import {
    RESTAURANT_KEYS,
    RestaurantsVote,
    RestaurantsVoteSummary,
    RestaurantsVoteSummaryDefault,
} from "./restaurants.ts";

export const handler: Handlers<null> = {
    async GET(req, ctx) {
        const kv = await Deno.openKv();

        const votes = kv.list<RestaurantsVote>({ prefix: ["votes"] });

        const summary = new Map();

        for await (const vote of votes) {
            for (const [restaurant, rank] of Object.entries(vote.value)) {
                let value = summary.get(restaurant) ?? 0;

                if (rank === "positive") value += 1;
                else if (rank === "negative") value -= 1;

                summary.set(restaurant, value);
            }
        }

        return Response.json(
            Object.fromEntries(summary.entries()),
        );
    },
};
