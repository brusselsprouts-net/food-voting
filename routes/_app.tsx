import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Brusselsprouts Food Votes</title>
        <link rel="stylesheet" href="/vars.css" />
        <link rel="stylesheet" href="/global.css" />
      </head>
      <body>
        <Component />
        <footer>
          &copy; 2024 ZBoink Inc.
        </footer>
      </body>
    </html>
  );
}
