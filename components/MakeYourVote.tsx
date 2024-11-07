import { Week } from "$lib/week.ts";

export default function MakeYourVote({ week }: { week: Week }) {
  const days_left = week.until.days;

  const format = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" });
  const relative_format = new Intl.RelativeTimeFormat("en-GB");

  let formatted_days_left;
  if (days_left === 0) {
    formatted_days_left = "today";
  } else {
    formatted_days_left = relative_format.format(
      week.until.days,
      "days",
    );
  }

  return (
    <h1>
      Make your vote {formatted_days_left} for {format.format(week.date)}
    </h1>
  );
}
