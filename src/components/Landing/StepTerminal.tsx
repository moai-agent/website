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
  gap: "",
};
const PROMPT = `${rgb("#f75e51")}$ ${RESET}`;

const LINE_HEIGHT = 1.4;

export function TermLines({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, i) =>
        line.kind === "gap" ? (
          <span key={i} className="term-line">{"\n"}</span>
        ) : (
          <span key={i} className={`term-line term-${line.kind}`}>
            {line.kind === "cmd" && <span className="term-prompt">$ </span>}
            {line.text}
            {"\n"}
          </span>
        ),
      )}
    </>
  );
}

export default function StepTerminal({ step }: { step: Step }) {
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

    const command = step.lines.find((l) => l.kind === "cmd")?.text ?? "";

    const print = (line: Line) => {
      if (line.kind === "gap") term!.write("\r\n");
      else if (line.kind === "cmd") term!.write(`${PROMPT}${COLOR.cmd}${line.text}${RESET}\r\n`);
      else term!.write(`${COLOR[line.kind]}${line.text}${RESET}\r\n`);
    };

    const play = async () => {
      for (const line of step.lines) {
        if (disposed) return;
        if (line.kind === "cmd" && !reduced) {
          term!.write(PROMPT + COLOR.cmd);
          for (let i = 0; i < line.text.length; i += 2) {
            term!.write(line.text.slice(i, i + 2));
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
      attachShell();
    };

    const attachShell = () => {
      let input = "";
      term!.onData((data) => {
        if (data === "\r") {
          const cmd = input.trim();
          input = "";
          term!.write("\r\n");
          if (cmd === "clear") term!.clear();
          else if (cmd === "help")
            term!.write(`${COLOR.out}Illustrative ahu ${AHU_VERSION} session, not live output. Try: ${COLOR.cmd}${command || "clear"}${RESET}\r\n`);
          else if (cmd && command && (cmd === command || cmd === command.split(" ").slice(0, 2).join(" "))) {
            for (const line of step.lines.slice(step.lines.findIndex((l) => l.kind === "cmd") + 1)) print(line);
          } else if (cmd)
            term!.write(`${COLOR.out}${cmd.split(" ")[0]}: not in this example. Install ahu to run it for real.${RESET}\r\n`);
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
      term = new Terminal({
        theme: THEME,
        fontFamily: family,
        fontSize: window.innerWidth < 640 ? 11 : 13,
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
        const longest = Math.max(...step.lines.map((l) => (l.kind === "cmd" ? 2 : 0) + l.text.length));
        const cols = step.wide ? Math.max(dims.cols, longest + 1) : Math.max(20, dims.cols);
        const rows =
          step.lines.reduce((n, l) => n + Math.max(1, Math.ceil(((l.kind === "cmd" ? 2 : 0) + l.text.length) / cols)), 0) + 3;
        term.resize(cols, rows);
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
  }, [step]);

  return (
    <div className="term">
      <div className="term-bar">
        <span>example/app</span>
        <span>illustrative · ahu {AHU_VERSION} syntax</span>
      </div>
      <div
        ref={hostRef}
        className={`term-xterm ${live ? "is-live" : ""} ${step.wide ? "is-wide" : ""}`}
        role="region"
        aria-label={`Replayable terminal: ${step.heading}`}
      />
      <pre className={`term-static ${live ? "sr-only" : ""} ${step.wide ? "is-wide" : ""}`}>
        <TermLines lines={step.lines} />
      </pre>
    </div>
  );
}
