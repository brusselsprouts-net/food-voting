export function hasOwnTyped<const O extends object, const T extends string>(
    object: O,
    key: T,
): object is O & { [x in T]: unknown } {
    return Object.hasOwn(object, key);
}

export function entriesTyped<const O extends object>(
    object: O,
): [keyof O, O[keyof O]][] {
    return Object.entries(object) as [keyof O, O[keyof O]][];
}
