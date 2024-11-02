export async function openKv() {
    return await Deno.openKv(
        Deno.env.get("ENVIRONMENT") === "development"
            ? "testdb/database"
            : undefined,
    );
}
