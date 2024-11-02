import { calculate_stats } from "../lib/stats.ts";

export default async function Stats() {
    const stats = await calculate_stats();

    let min = 0;
    let max = 0;

    for (const [_, [detract, promote]] of stats.entries()) {
        min = Math.min(min, detract);
        max = Math.max(max, promote);
    }

    const sorted = stats.entries().toArray().sort(([_a, [a_detract, a_promote]], [_b, [b_detract, b_promote]]) => {
        return (b_detract + b_promote) - (a_detract + a_promote);
    });

    return (
        <>
            {sorted.map(([key, [detract, promote]]) => (
                <div style={{ display: "flex" }}>
                    <span style={{ margin: "auto" }}>{key}</span>
                    <span
                        style={{
                            width: "50em",
                            height: "1em",
                            // background: "",
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                height: "100%",
                                left: "50%",
                                width: `${50 * Math.max(promote, 0) / max}%`,
                                backgroundColor: "green",
                            }}
                        />

                        <span
                            style={{
                                position: "absolute",
                                height: "100%",
                                right: "50%",
                                width: `${
                                    50 * Math.abs(Math.min(detract, 0)) / max
                                }%`,
                                backgroundColor: "red",
                            }}
                        />
                    </span>
                </div>
            ))}
        </>
    );
}
