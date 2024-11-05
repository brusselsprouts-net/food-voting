import { assert } from "$std/assert/assert.ts";

function next_thursday(date: Temporal.PlainDate): Temporal.PlainDate {
  const days_until_thursday = (11 - date.dayOfWeek) % 7;

  return date.add({ days: days_until_thursday });
}

export class Week {
  #thursday: Temporal.PlainDate;

  public get year(): number {
    return this.#thursday.yearOfWeek ?? this.#thursday.year;
  }
  public get number(): number {
    return this.#thursday.weekOfYear!;
  }
  public get date(): Temporal.PlainDate {
    return this.#thursday;
  }
  public get until(): Temporal.Duration {
    return Temporal.Now.plainDateISO().until(this.#thursday);
  }

  private constructor(day: Temporal.PlainDate) {
    assert(day.dayOfWeek === 4, "provided day not a thursday");
    this.#thursday = day;
  }

  static current(): Week {
    return new Week(next_thursday(Temporal.Now.plainDateISO()));
  }

  static from_week_nr(year: number, week_nr: number): Week {
    const start_of_year = new Temporal.PlainDate(year, 1, 1);

    const first_thursday = next_thursday(start_of_year);

    return new Week(first_thursday.add({ weeks: week_nr - 1 }));
  }

  next(): Week {
    return new Week(this.#thursday.add({ weeks: 1 }));
  }

  previous(): Week {
    return new Week(this.#thursday.subtract({ weeks: 1 }));
  }

  further_than_next_week(): boolean {
    return  Temporal.Now.plainDateISO().until(this.#thursday).days > 6;
  }
}
