export function next_thursday(date: Temporal.PlainDate): Temporal.PlainDate {
    const daysUntilThursday = (11 - date.dayOfWeek) % 7;
    const adjustedDate = date.add({ days: daysUntilThursday });

    return adjustedDate;
}

export function current_week(): Week {
    const today = Temporal.Now.plainDateISO();
    const thursday = next_thursday(today);

    return {
        number: thursday.weekOfYear!,
        year: thursday.yearOfWeek ?? thursday.year,
    };
}

export type Week = {
    year: number;
    number: number;
};
