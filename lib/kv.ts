import { RestaurantsVote, RestaurantsVoteType } from "$lib/restaurants.ts";
import { UserInfo, UserInfoType } from "$lib/oauth.ts";
import { Week } from "$lib/week.ts";

export async function set_vote(
  week: Week,
  user: UserInfoType,
  vote: RestaurantsVoteType,
  kv?: Deno.Kv,
) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  // TODO: do we store historical data like this?
  await kv.set(["votes", week.year, week.number, user.sub], vote);
}

export async function get_vote(week: Week, user: UserInfoType, kv?: Deno.Kv) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  const entry = await kv.get(
    ["votes", week.year, week.number, user.sub],
  );

  if (entry.value === null) {
    return undefined;
  }

  const votes_parsed = RestaurantsVote.safeParse(entry.value);

  if (!votes_parsed.success) {
    console.warn(
      "Encountered bad data from KV, pruning",
      entry.key,
      votes_parsed.error.format(),
    );
    await kv.delete(entry.key);
    return undefined;
  }

  return votes_parsed.data;
}

export async function* all_votes(week: Week, kv?: Deno.Kv) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  const list = kv.list({
    prefix: ["votes", week.year, week.number],
  });

  while (true) {
    const next = await list.next();
    if (next.done === true) return undefined;
    const entry = next.value;

    const next_parsed = RestaurantsVote.safeParse(entry.value);

    if (!next_parsed.success) {
      console.warn(
        "Encountered bad data from KV, pruning",
        entry.key,
        next_parsed.error.format(),
      );
      await kv.delete(entry.key);
      continue;
    }

    const [_votes, _year, _week, user_id] = entry.key;

    yield { user_id: user_id.toString(), vote: next_parsed.data };
  }
}

export async function* all_users(kv?: Deno.Kv) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  const list = kv.list({
    prefix: ["user-info"],
  });

  while (true) {
    const next = await list.next();
    if (next.done === true) return undefined;
    const entry = next.value;

    const next_parsed = UserInfo.safeParse(entry.value);

    if (!next_parsed.success) {
      console.warn(
        "Encountered bad data from KV, pruning",
        entry.key,
        next_parsed.error.format(),
      );
      await kv.delete(entry.key);
      continue;
    }

    yield next_parsed.data;
  }
}

export async function user_session(session_id: string, kv?: Deno.Kv) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  const entry = await kv.get(["user-session", session_id]);

  if (entry.value === null) {
    return undefined;
  }

  const parsed = UserInfo.safeParse(entry.value);

  if (!parsed.success) {
    console.warn(
      "Encountered bad data from KV, pruning",
      entry.key,
      parsed.error.format(),
    );
    await kv.delete(entry.key);
    return undefined;
  }

  return parsed.data;
}

export async function create_user_session(
  session_id: string,
  user_info: UserInfoType,
  kv?: Deno.Kv,
) {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  await kv.set(["user-session", session_id], user_info, {
    expireIn: 7776000 * 1000, // 90 days
  });
  await kv.set(["user-info", user_info.sub], user_info, {
    expireIn: 7776000 * 1000, // 90 days
  });
}

export async function weeks_exist(
  weeks: Week[],
  kv?: Deno.Kv,
): Promise<boolean[]> {
  if (kv === undefined) {
    kv = await Deno.openKv();
  }

  return await Promise.all(
    weeks.map(async (week) => {
      const entry = await kv.list(
        { prefix: ["votes", week.year, week.number] },
        { limit: 1 },
      )
        .next();

      return entry.value !== undefined;
    }),
  );
}
