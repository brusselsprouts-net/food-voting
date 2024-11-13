import Header from "$components/Header.tsx";
import { FreshContext } from "$fresh/server.ts";
import { Authentication } from "$lib/oauth.ts";
import { all_site_sessions, all_user_sessions, all_users } from "$lib/kv.ts";

export default async function Admin(
  _req: Request,
  ctx: FreshContext<Authentication>,
) {
  const kv = await Deno.openKv();

  const [site_sessions, user_sessions, users] = await Promise.all([
    Array.fromAsync(all_site_sessions(kv)),
    Array.fromAsync(all_user_sessions(kv)),
    Array.fromAsync(all_users(kv)),
  ]);

  return (
    <>
      <Header user_info={ctx.state.user_info} />
      <h1>ADMIN PAGE</h1>
      <pre>{JSON.stringify(site_sessions, undefined, 2)}</pre>
      <pre>{JSON.stringify(user_sessions, undefined, 2)}</pre>
      <pre>{JSON.stringify(users, undefined, 2)}</pre>
    </>
  );
}
