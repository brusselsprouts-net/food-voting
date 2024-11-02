import { useSignal } from "@preact/signals";
import Place from "../components/Place.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { RESTAURANT_ENTRIES } from "./api/restaurants.ts";

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
        <div>
          {RESTAURANT_ENTRIES.map(([id, place_name]) => (
            <Place name={place_name} id={id} key={id}></Place>
          ))}
        </div>
      </form>
    </>
  );
}
