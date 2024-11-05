import { VoteType } from "$lib/restaurants.ts";

export default function Place(
  { name, id, previous }: { name: string; id: string; previous?: VoteType },
) {
  return (
    <div class="place">
      <div class="name">{name}</div>
      <label class="positive">
        Positive
        <input
          type="radio"
          name={id}
          value="positive"
          checked={previous === "positive"}
        />
      </label>
      <label class="neutral">
        Neutral
        <input
          type="radio"
          name={id}
          value="neutral"
          checked={previous === undefined || previous === "neutral"}
        />
      </label>
      <label class="negative">
        Negative
        <input
          type="radio"
          name={id}
          value="negative"
          checked={previous === "negative"}
        />
      </label>
    </div>
  );
}
