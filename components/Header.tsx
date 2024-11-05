import { UserInfo } from "$lib/oauth.ts";

interface Props {
  user_info: UserInfo;
}

export default function Header({ user_info }: Props) {
  return (
    <header>
      <nav>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/vote">Vote</a>
        </li>
        <li>
          <a href="/stats">Stats</a>
        </li>
      </nav>
      <div class="user">
        <img
          referrerpolicy="no-referrer"
          src={user_info.picture}
          alt={`Profile picture of ${user_info.name}`}
        />
        <div>Hello {user_info.name}</div>
      </div>
      <nav>
        <li>
          <a href="/oauth/signout">Sign Out</a>
        </li>
      </nav>
    </header>
  );
}
