import { useSignal } from "@preact/signals";
import Place from "../components/Place.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<string[]> = {
  async GET(_req, ctx) {
    const response = await fetch(
      "https://raw.githubusercontent.com/brusselsprouts-net/RandomRestaurantPicker/refs/heads/main/restaurants.txt",
    );
    const restaurants = (await response.text()).split("\n").filter((x) =>
      x.length > 0
    );

    const resp = await ctx.render(restaurants);
    resp.headers.set("X-Custom-Header", "Hello");
    return resp;
  },
};

export default function Home(props: PageProps<string[]>) {
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
      <form action="/api/vote" method="post" class="suggestion_form">
        <input type="reset" />
        <input type="submit" />
        <div>
          {props.data.map((place) => <Place name={place} key={place}></Place>)}
        </div>
      </form>
    </>
  );
}
