/**
 * Renders the social card to `public/og.png` before `next build`.
 *
 * The `opengraph-image` file convention would emit an extensionless file that
 * GitHub Pages serves as application/octet-stream, which crawlers reject. A
 * real .png in `public/` gets the right Content-Type and a stable URL.
 *
 * The org profile portrait is 605x900, and social cards are 1.91:1 — pasting
 * it in directly would crop a band across the middle of the face. Instead it
 * is laid in at full height on the right and faded into black, with the
 * wordmark carrying the left.
 *
 * Uses the bundled default font rather than Atkinson, so this needs no network.
 */
import { readFile, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

const WIDTH = 1200;
const HEIGHT = 630;

// 605x900 scaled to full card height.
const PORTRAIT_WIDTH = Math.round((605 / 900) * HEIGHT);

/*
 * Satori cannot parse oklch(), and silently renders it as black — which is
 * invisible on this card. These are the sRGB equivalents of the two glitch
 * colours the site uses in globals.css.
 */
const TEAR_RED = "#cc272e"; // oklch(0.55 0.2 25)
const TEAR_BLUE = "#3a93e6"; // oklch(0.65 0.15 250)

const PAD_LEFT = 84;
const WORD_TOP = 225;

const moai = await readFile("assets/moai.jpg");
const moaiSrc = `data:image/jpeg;base64,${moai.toString("base64")}`;

/*
 * Satori only honours offsets on children of a sized, relatively positioned
 * ancestor — nesting these in an auto-sized flex wrapper silently collapses
 * all three layers onto the same pixel. They are placed against the root.
 */
const word = (color: string, dx: number, dy: number) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      left: PAD_LEFT + dx,
      top: WORD_TOP + dy,
      fontSize: 160,
      letterSpacing: "0.28em",
      color,
      // Matches the 0.7 the tear layers carry in globals.css.
      opacity: color === "#ffffff" ? 1 : 0.7,
    }}
  >
    ahu
  </div>
);

const image = new ImageResponse(
  (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        position: "relative",
        display: "flex",
        background: "#000000",
      }}
    >
      <img
        src={moaiSrc}
        width={PORTRAIT_WIDTH}
        height={HEIGHT}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
      {/* Feather the portrait's left edge into the black field. */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: PORTRAIT_WIDTH + 120,
          height: HEIGHT,
          background:
            "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0) 78%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: PAD_LEFT,
          top: 232,
          display: "flex",
          fontSize: 26,
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        moai-agent.com
      </div>

      {word(TEAR_RED, -5, -3)}
      {word(TEAR_BLUE, 5, 3)}
      {word("#ffffff", 0, 0)}
    </div>
  ),
  { width: WIDTH, height: HEIGHT },
);

const buffer = Buffer.from(await image.arrayBuffer());
await writeFile("public/og.png", buffer);
console.log(`wrote public/og.png (${WIDTH}x${HEIGHT}, ${buffer.length} bytes)`);
