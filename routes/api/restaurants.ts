import restaurants from "../../static/restaurants.json" with { type: "json" };

export const RESTAURANT_ENTRIES = Object.entries(restaurants) as [
    unknown,
    string,
][] as [RestaurantsKey, string][];
export const RESTAURANT_KEYS = Object.keys(
    restaurants,
) as unknown[] as RestaurantsKey[];
export type Restaurants = typeof restaurants;
export type RestaurantsKey = keyof Restaurants;

export type RestaurantsVote = {
    [x in RestaurantsKey]: "positive" | "negative" | "neutral";
};
export type RestaurantsVoteSummary = {
    [x in RestaurantsKey]: number;
};

export const RestaurantsVoteSummaryDefault = RESTAURANT_KEYS.reduce<
    RestaurantsVoteSummary
>(
    (previous, current) => ({ ...previous, [current]: 0 }),
    {} as RestaurantsVoteSummary,
);
