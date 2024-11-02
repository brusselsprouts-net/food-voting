import { getRestaurantName } from "../lib/restaurants.ts";
import { calculate_stats, score } from "../lib/stats.ts";
import { current_week } from "../lib/week.ts";

export default async function Stats() {
  const week = current_week();

  const { summary, votes } = await calculate_stats(week);

  const sorted = summary.entries().toArray().sort(
    ([_a, a], [_b, b]) => {
      return score(b) - score(a);
    },
  );

  return (
    <>
      <h1>Week {week.number}, {week.year}</h1>
      {sorted.map(([key, { negative, positive }]) => (
        <div style={{ display: "flex" }}>
          <span style={{ margin: "auto", marginInlineEnd: 0 }}>{getRestaurantName(key)}</span>
          <span
            style={{
              width: "50em",
              height: "1em",
              // background: "#80808080",
              position: "relative",
              display: "inline-block",
            }}
          >
            <span
              style={{
                position: "absolute",
                height: "100%",
                right: "50%",
                width: `${50 * negative.length / votes}%`,
                backgroundColor: "red",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {negative.map((x) => <span>{x}</span>)}
            </span>

            <span
              style={{
                position: "absolute",
                height: "100%",
                left: "50%",
                width: `${50 * positive.length / votes}%`,
                backgroundColor: "green",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {positive.map((x) => <span>{x}</span>)}
            </span>
          </span>
        </div>
      ))}
    </>
  );
}
