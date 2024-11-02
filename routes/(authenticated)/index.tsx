import Place from "$components/Place.tsx";
import { RESTAURANT_ENTRIES } from "$lib/restaurants.ts";

export default function Home() {
  return (
    <>
      <form>
        <input
          type="text"
          name="suggestion"
          id="suggestion"
          placeholder={"Ribs Factory"}
          style={{ width: "100%" }}
        />
      </form>
      <form action="/api/votes" method="post" class="suggestion_form">
        <input type="reset" />
        <input type="submit" />
        <input type="text" name="user_id" placeholder={"User ID"} />
        <div>
          {RESTAURANT_ENTRIES.map(([id, place_name]) => (
            <Place name={place_name} id={id} key={id}></Place>
          ))}
        </div>
      </form>
    </>
  );
}
