import restaurants from "./restaurants.json" with { type: "json" };
import { z } from "zod";

export const RESTAURANT_ENTRIES = Object.entries(restaurants) as [
  unknown,
  string,
][] as [RestaurantsKeyType, string][];
const RESTAURANT_KEYS = Object.keys(
  restaurants,
) as unknown[] as [keyof typeof restaurants];

export function getRestaurantName(id: RestaurantsKeyType) {
  return restaurants[id] ?? `(unknown) {${id}}`;
}

export const Vote = z.enum(["positive", "negative", "neutral"]);
export type VoteType = z.infer<typeof Vote>;

export const RestaurantKey = z.enum(RESTAURANT_KEYS);
export type RestaurantsKeyType = z.infer<typeof RestaurantKey>;

export const RestaurantsVote = z.map(RestaurantKey, Vote.optional());
export type RestaurantsVoteType = z.infer<typeof RestaurantsVote>;
