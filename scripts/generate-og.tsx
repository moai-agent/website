/**
 * Renders the social card to `public/og.png` before `next build`.
 *
 * The `opengraph-image` file convention would emit an extensionless file that
 * GitHub Pages serves as application/octet-stream, which crawlers reject. A
 * real .png in `public/` gets the right Content-Type and a stable URL.
 *
 * Uses the bundled default font rather than Atkinson, so this needs no network.
 */
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

const WIDTH = 1200;
const HEIGHT = 630;

const word = (color: string, dx: number, dy: number) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      fontSize: 96,
      letterSpacing: "0.35em",
      color,
      transform: `translate(${dx}px, ${dy}px)`,
    }}
  >
    becoming...
  </div>
);

const image = new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
      }}
    >
      {/* Offset colour copies, frozen mid-tear. */}
      {word("#22d3ee", -7, -3)}
      {word("#ff00ff", 6, 3)}
      {word("#ffffff", 0, 0)}
    </div>
  ),
  { width: WIDTH, height: HEIGHT },
);

const buffer = Buffer.from(await image.arrayBuffer());
await writeFile("public/og.png", buffer);
console.log(`wrote public/og.png (${WIDTH}x${HEIGHT}, ${buffer.length} bytes)`);
