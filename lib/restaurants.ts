import restaurants from "../static/restaurants.json" with { type: "json" };

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

export function getRestaurantName(id: RestaurantsKey) {
    return restaurants[id];
}
