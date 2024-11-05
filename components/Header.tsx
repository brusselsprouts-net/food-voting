import { UserInfo } from "$lib/oauth.ts";

interface Props {
  user_info: UserInfo;
}

export default function Header({ user_info }: Props) {
  return (
    <>
      <nav>
        <li>
          <a href="/stats">Stats</a>
        </li>
        <li>
          <a href="/vote">Vote</a>
        </li>
      </nav>
      <p>
        Hello {user_info.name}
        <img
          src={user_info.picture}
          alt={`Profile picture of ${user_info.name}`}
        />
      </p>
      <nav>
        <li>
          <a href="/oauth/signout">Sign Out</a>
        </li>
      </nav>
    </>
  );
}
