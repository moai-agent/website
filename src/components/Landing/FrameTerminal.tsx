"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FRAME_COLS } from "./harnessFrames";

/*
 * Captured harness screens rendered as HTML, the way Ghostty draws them in cmux:
 * the terminal's own palette, JetBrains Mono, and block elements (the harness
 * logos) as exact cell quadrants rather than font glyphs. Frames are static
 * snapshots, so no emulator is needed; they play in order, then hold.
 */

/** The shell beat is one line to read; the harness screens hold longer. */
const HOLD_FIRST_MS = 1800;
const HOLD_MS = 3200;

/** cmux's 16 ANSI colours (Ghostty defaults), read back over OSC 4. */
const ANSI16 = [
  "#1a1a1a", "#cc372e", "#26a439", "#cdac08", "#0869cb", "#9647bf", "#479ec2", "#98989d",
  "#464646", "#ff453a", "#32d74b", "#ffd60a", "#0a84ff", "#bf5af2", "#76d6ff", "#ffffff",
];
const FG = "#ffffff";

const palette = (n: number) => {
  if (n < 16) return ANSI16[n];
  if (n < 232) {
    const steps = [0, 95, 135, 175, 215, 255];
    const i = n - 16;
    return `rgb(${steps[Math.floor(i / 36)]} ${steps[Math.floor(i / 6) % 6]} ${steps[i % 6]})`;
  }
  const g = 8 + (n - 232) * 10;
  return `rgb(${g} ${g} ${g})`;
};

/** Quadrants each block element fills: top-left 1, top-right 2, bottom-left 4, bottom-right 8. */
const BLOCKS: Record<string, number> = {
  "█": 15, "▀": 3, "▄": 12, "▌": 5, "▐": 10, "▘": 1, "▝": 2, "▖": 4, "▗": 8,
  "▚": 9, "▞": 6, "▛": 7, "▜": 11, "▙": 13, "▟": 14,
};
const QUADRANT_AT = [
  [1, "0 0"],
  [2, "100% 0"],
  [4, "0 100%"],
  [8, "100% 100%"],
] as const;
const quadrants = (bits: number) =>
  QUADRANT_AT.filter(([bit]) => bits & bit).map(([, at]) => `linear-gradient(currentColor, currentColor) ${at} / 50% 50% no-repeat`);

/**
 * Box-drawing corners and elbows: which edges of an inset box carry the stroke,
 * and whether the corner is rounded. The box runs from the cell's centre to the
 * sides the glyph connects to.
 */
const CORNERS: Record<string, CSSProperties> = {
  "╭": { left: "50%", top: "50%", right: 0, bottom: 0, borderLeftWidth: 1, borderTopWidth: 1, borderTopLeftRadius: "0.3em" },
  "╮": { left: 0, top: "50%", right: "50%", bottom: 0, borderRightWidth: 1, borderTopWidth: 1, borderTopRightRadius: "0.3em" },
  "╰": { left: "50%", top: 0, right: 0, bottom: "50%", borderLeftWidth: 1, borderBottomWidth: 1, borderBottomLeftRadius: "0.3em" },
  "╯": { left: 0, top: 0, right: "50%", bottom: "50%", borderRightWidth: 1, borderBottomWidth: 1, borderBottomRightRadius: "0.3em" },
  "┌": { left: "50%", top: "50%", right: 0, bottom: 0, borderLeftWidth: 1, borderTopWidth: 1 },
  "┐": { left: 0, top: "50%", right: "50%", bottom: 0, borderRightWidth: 1, borderTopWidth: 1 },
  "└": { left: "50%", top: 0, right: 0, bottom: "50%", borderLeftWidth: 1, borderBottomWidth: 1 },
  "┘": { left: 0, top: 0, right: "50%", bottom: "50%", borderRightWidth: 1, borderBottomWidth: 1 },
};

/** Box-drawing lines Ghostty draws as geometry, centred in the cell. */
const LINES: Record<string, string> = {
  "─": "linear-gradient(currentColor, currentColor) 0 50% / 100% 1px no-repeat",
  "│": "linear-gradient(currentColor, currentColor) 50% 0 / 1px 100% no-repeat",
};

interface Style {
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
}

/** Apply one SGR sequence's parameters to the running style. */
function sgr(params: number[], s: Style): Style {
  const next = { ...s };
  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    if (p === 0) Object.keys(next).forEach((k) => delete next[k as keyof Style]);
    else if (p === 1) next.bold = true;
    else if (p === 2) next.dim = true;
    else if (p === 3) next.italic = true;
    else if (p === 4) next.underline = true;
    else if (p === 7) next.inverse = true;
    else if (p === 39) delete next.fg;
    else if (p === 49) delete next.bg;
    else if (p >= 30 && p <= 37) next.fg = ANSI16[p - 30];
    else if (p >= 90 && p <= 97) next.fg = ANSI16[p - 82];
    else if (p >= 40 && p <= 47) next.bg = ANSI16[p - 40];
    else if (p >= 100 && p <= 107) next.bg = ANSI16[p - 92];
    else if (p === 38 || p === 48) {
      const key = p === 38 ? "fg" : "bg";
      if (params[i + 1] === 2) {
        next[key] = `rgb(${params[i + 2]} ${params[i + 3]} ${params[i + 4]})`;
        i += 4;
      } else if (params[i + 1] === 5) {
        next[key] = palette(params[i + 2]);
        i += 2;
      }
    }
  }
  return next;
}

const colours = (s: Style) => (s.inverse ? [s.bg ?? "#1e1e1e", s.fg ?? FG] : [s.fg, s.bg]);

const css = (s: Style): CSSProperties => {
  const [fg, bg] = colours(s);
  return {
    color: fg,
    // Always the shorthand: cells swap between text and drawn geometry across frames.
    background: bg,
    fontWeight: s.bold ? 700 : undefined,
    fontStyle: s.italic ? "italic" : undefined,
    textDecoration: s.underline ? "underline" : undefined,
    opacity: s.dim ? 0.55 : undefined,
  };
};

/**
 * One row of ANSI as spans. ASCII runs stay text; every other character gets its
 * own exact cell, so a glyph from a fallback font can never shift the grid. Block
 * elements and rules are drawn as geometry in the cell, as Ghostty does.
 */
function Row({ ansi }: { ansi: string }) {
  const out: ReactNode[] = [];
  let style: Style = {};
  let run = "";
  const flush = () => {
    if (run) out.push(<span key={out.length} style={css(style)}>{run}</span>);
    run = "";
  };
  for (const m of ansi.matchAll(/\x1b\[([0-9;]*)m|([\s\S])/gu)) {
    if (m[1] !== undefined) {
      flush();
      style = sgr(m[1] ? m[1].split(";").map(Number) : [0], style);
    } else if (m[2] <= "~") run += m[2];
    else {
      flush();
      const ch = m[2];
      const drawn = BLOCKS[ch] ? quadrants(BLOCKS[ch]) : LINES[ch] ? [LINES[ch]] : null;
      const bg = colours(style)[1];
      out.push(
        CORNERS[ch] ? (
          <span key={out.length} className="frame-cell frame-corner" style={css(style)}>
            <i style={CORNERS[ch]} />
          </span>
        ) : drawn ? (
          <span
            key={out.length}
            className="frame-cell"
            style={{ ...css(style), background: [...drawn, bg ?? "transparent"].join(", ") }}
          />
        ) : (
          <span key={out.length} className="frame-cell" style={css(style)}>
            {ch}
          </span>
        ),
      );
    }
  }
  flush();
  return <div className="frame-row">{out.length ? out : " "}</div>;
}

export default function FrameTerminal({
  frames,
  label,
  screen,
}: {
  frames: string[][];
  label: string;
  /** The harness's own screen colour, when it paints one over the terminal's. */
  screen?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  // Play once the panel is well in view; reduced motion goes straight to the result.
  useEffect(() => {
    const last = frames.length - 1;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(last);
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        for (let i = 1; i <= last; i++)
          timers.push(window.setTimeout(() => setShown(i), HOLD_FIRST_MS + HOLD_MS * (i - 1)));
      },
      { threshold: 0.35 },
    );
    io.observe(ref.current!);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [frames]);

  const rows = Math.max(...frames.map((f) => f.length));
  return (
    <div
      ref={ref}
      className="frame"
      role="region"
      aria-label={`Illustrative terminal: ${label}`}
      style={screen ? { background: screen } : undefined}
    >
      <div className="frame-screen" style={{ "--cols": FRAME_COLS, "--rows": rows } as CSSProperties}>
        {frames[shown].map((ansi, i) => (
          <Row key={i} ansi={ansi} />
        ))}
      </div>
    </div>
  );
}
