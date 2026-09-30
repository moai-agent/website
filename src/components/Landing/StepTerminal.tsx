"use client";

import { useEffect, useRef, useState } from "react";
import type { Terminal } from "@xterm/xterm";
import { AHU_VERSION, type Line, type Step } from "./transcript";

/*
 * One xterm.js terminal per step, after or13.io's XtermTerminal. It types the
 * step's illustrative (synthetic) ahu session when it scrolls into view, then
 * leaves a prompt: the step's own command replays the example, `help`
 * explains, and anything else points at installing ahu. The static transcript underneath is
 * what renders without JavaScript and what screen readers read.
 */

// Hex copies of the landing.css tokens; xterm cannot read CSS variables.
const THEME = {
  background: "#050607",
  foreground: "#9aa7ab",
  cursor: "#f0f2f3",
  cursorAccent: "#050607",
  selectionBackground: "#22292b",
  selectionForeground: "#f0f2f3",
};

/**
 * cmux's own terminal colours (Ghostty defaults), read back over OSC 10/11/4, for
 * harness views typed as transcripts; captured frames use FrameTerminal.
 */
const NATIVE_THEME = {
  background: "#1e1e1e",
  foreground: "#ffffff",
  cursor: "#ffffff",
  cursorAccent: "#1e1e1e",
  selectionBackground: "#3a3a3a",
  black: "#1a1a1a",
  red: "#cc372e",
  green: "#26a439",
  yellow: "#cdac08",
  blue: "#0869cb",
  magenta: "#9647bf",
  cyan: "#479ec2",
  white: "#98989d",
  brightBlack: "#464646",
  brightRed: "#ff453a",
  brightGreen: "#32d74b",
  brightYellow: "#ffd60a",
  brightBlue: "#0a84ff",
  brightMagenta: "#bf5af2",
  brightCyan: "#76d6ff",
  brightWhite: "#ffffff",
};

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `\x1b[38;2;${n >> 16};${(n >> 8) & 255};${n & 255}m`;
};
const RESET = "\x1b[0m";
const COLOR: Record<Line["kind"], string> = {
  cmd: rgb("#f0f2f3"),
  out: rgb("#9aa7ab"),
  key: rgb("#79b6f4"),
  warn: rgb("#f75e51"),
  dim: rgb("#78858a"),
  gap: "",
};
/** The shell's `$ ` is red; a harness's own prompt glyph stays quiet. */
const promptEsc = (prompt: string) => `${prompt === "$ " ? COLOR.warn : COLOR.dim}${prompt}${RESET}`;

const LINE_HEIGHT = 1.4;


/**
 * Break a line at spaces so no word splits across rows. Continuation rows hang
 * under the line's own indent, past a leading "- " bullet. A single word longer
 * than the row still breaks, since there is nowhere else to put it.
 */
export function wrap(text: string, cols: number): string[] {
  if (text.length <= cols) return [text];
  // Bullets and harness glyphs (Claude Code's ⎿, Codex's └) hang like "- ".
  let lead = /^ *(?:- |[⎿└●⏺•┃] +)?/.exec(text)![0].length;
  if (lead > cols / 2) lead = 0;
  // A gutter bar (OpenCode's ┃) continues down the wrapped rows; everything else becomes space.
  const hang = text.slice(0, lead).replace(/[^┃]/g, " ");
  const rows: string[] = [];
  let row = text.slice(0, lead);
  let fresh = true;
  // Splitting on single spaces keeps runs of spaces, so aligned columns survive.
  for (const word of text.slice(lead).split(" ")) {
    if (!fresh && row.length + 1 + word.length > cols) {
      rows.push(row.trimEnd());
      row = hang;
      fresh = true;
      if (!word) continue;
    }
    row += (fresh ? "" : " ") + word;
    fresh = false;
    while (row.length > cols) {
      rows.push(row.slice(0, cols));
      row = hang + row.slice(cols);
    }
  }
  rows.push(row);
  return rows;
}

export function TermLines({ lines, prompt = "$ " }: { lines: Line[]; prompt?: string }) {
  return (
    <>
      {lines.map((line, i) =>
        line.kind === "gap" ? (
          <span key={i} className="term-line">{"\n"}</span>
        ) : (
          <span key={i} className={`term-line term-${line.kind}`}>
            {line.kind === "cmd" && <span className="term-prompt">{prompt}</span>}
            {line.text}
            {"\n"}
          </span>
        ),
      )}
    </>
  );
}

export default function StepTerminal({
  step,
  lines = step.lines,
  prompt = "$ ",
  native = false,
}: {
  step: Step;
  /** A harness variant's lines, when the step has several. */
  lines?: Line[];
  prompt?: string;
  /** Render as cmux does (its colours and font), for harness views. */
  native?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let term: Terminal | null = null;
    let disposed = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const command = lines.find((l) => l.kind === "cmd")?.text ?? "";

    // A command's rows after the first sit under its text, past the prompt.
    const PROMPT = promptEsc(prompt);
    const indent = " ".repeat(prompt.length);
    const rowsOf = (line: Line) =>
      line.kind === "cmd"
        ? wrap(line.text, term!.cols - prompt.length).join(`\r\n${indent}`)
        : wrap(line.text, term!.cols).join("\r\n");

    const print = (line: Line) => {
      if (line.kind === "gap") term!.write("\r\n");
      else if (line.kind === "cmd") term!.write(`${PROMPT}${COLOR.cmd}${rowsOf(line)}${RESET}\r\n`);
      else term!.write(`${COLOR[line.kind]}${rowsOf(line)}${RESET}\r\n`);
    };

    let played = false;
    const play = async () => {
      for (const line of lines) {
        if (disposed) return;
        if (line.kind === "cmd" && !reduced) {
          const text = rowsOf(line);
          term!.write(PROMPT + COLOR.cmd);
          for (let i = 0; i < text.length; i += 2) {
            term!.write(text.slice(i, i + 2));
            await wait(16);
          }
          term!.write(`${RESET}\r\n`);
          await wait(220);
        } else {
          print(line);
          if (!reduced) await wait(45);
        }
      }
      term!.write(PROMPT);
      played = true;
      attachShell();
    };

    const attachShell = () => {
      let input = "";
      term!.onData((data) => {
        if (data === "\r") {
          const cmd = input.trim().replace(/\s+/g, " ");
          input = "";
          term!.write("\r\n");
          if (cmd === "clear") term!.clear();
          else if (cmd === "help")
            print({ kind: "out", text: `Illustrative ahu ${AHU_VERSION} session, not live output. Try: ${command || "clear"}` });
          // Replay only the exact example: a shortened form like `ahu mcp` is not
          // a valid v0.6.0 command and must not appear to succeed.
          else if (cmd && command && cmd === command) {
            for (const line of lines.slice(lines.findIndex((l) => l.kind === "cmd") + 1)) print(line);
          } else if (cmd)
            print({ kind: "out", text: `${cmd.split(" ")[0]}: not in this example. Install ahu to run it for real.` });
          term!.write(PROMPT);
        } else if (data === "\x7f" || data === "\b") {
          if (input) {
            input = input.slice(0, -1);
            term!.write("\b \b");
          }
        } else if (data === "\x03") {
          input = "";
          term!.write(`^C\r\n${PROMPT}`);
        } else if (data >= " " && !data.startsWith("\x1b")) {
          input += data;
          term!.write(data);
        }
      });
    };

    const init = async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
        import("@xterm/xterm/css/xterm.css"),
      ]);
      await document.fonts.ready;
      if (disposed) return;
      const family = getComputedStyle(host).fontFamily;
      // Tables drop a point so the widest rows fit beside nothing but the gutter.
      const baseFont = window.innerWidth < 640 ? 11 : step.wide ? 12 : 13;
      term = new Terminal({
        theme: native ? NATIVE_THEME : THEME,
        fontFamily: family,
        fontSize: baseFont,
        lineHeight: LINE_HEIGHT,
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 200,
        convertEol: false,
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(host);

      // Size to the transcript: columns from the width, rows from the wrapped
      // line count, so the terminal never scrolls and never traps the wheel.
      const size = () => {
        const dims = fit.proposeDimensions();
        if (!dims || !term) return;
        // Tables keep their rows whole: widen past the panel and scroll sideways.
        const longest = Math.max(...lines.map((l) => (l.kind === "cmd" ? prompt.length : 0) + l.text.length));
        const cols = step.wide ? Math.max(dims.cols, longest) : Math.max(20, dims.cols);
        const rows =
          lines.reduce((n, l) => n + wrap(l.text, l.kind === "cmd" ? cols - prompt.length : cols).length, 0) + 1;
        if (cols === term.cols && rows === term.rows) return;
        term.resize(cols, rows);
        // Wrapped rows are hard breaks, so a finished session is redrawn at the new width.
        if (played) {
          term.reset();
          lines.forEach(print);
          term.write(PROMPT);
        }
      };
      size();
      setLive(true);

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(size, 150);
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io.disconnect();
            play();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(host.parentElement!);
      cleanups.push(() => io.disconnect());
    };

    const cleanups: (() => void)[] = [];
    // Build the terminal only as it approaches the viewport.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          near.disconnect();
          init();
        }
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(host.parentElement!);

    return () => {
      disposed = true;
      near.disconnect();
      for (const id of timers) window.clearTimeout(id);
      for (const fn of cleanups) fn();
      term?.dispose();
    };
  }, [step, lines, prompt, native]);

  return (
    <div className={`term ${native ? "term--native" : ""}`}>
      <div
        ref={hostRef}
        className={`term-xterm ${live ? "is-live" : ""} ${step.wide ? "is-wide" : ""}`}
        role="region"
        aria-label={`Illustrative terminal: ${step.heading}`}
      />
      <pre className={`term-static ${live ? "sr-only" : ""} ${step.wide ? "is-wide" : ""}`}>
        <TermLines lines={lines} prompt={prompt} />
      </pre>
    </div>
  );
}
