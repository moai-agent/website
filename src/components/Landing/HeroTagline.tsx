"use client";

import { useEffect, useState } from "react";
import DecryptText from "./DecryptText";

/** The harnesses ahu v0.5.0 launches, by product name. Antigravity, not the model behind it. */
const HARNESSES = ["Claude Code", "Codex", "Antigravity", "OpenCode"];

const HOLD_MS = 5200;
/** Milliseconds per decrypt step; or13.io's default of 40 reads too fast for a rotating line. */
const DECRYPT_MS = 75;

/**
 * The hero line: a fixed sentence over a mono line that decrypts through runs
 * of three harnesses. The names sit on their own centered line so names of
 * different lengths never reflow the sentence. Screen readers get the whole sentence
 * once; reduced motion keeps the first three.
 */
export default function HeroTagline() {
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = window.setInterval(() => setStart((s) => (s + 1) % HARNESSES.length), HOLD_MS);
    return () => window.clearInterval(tick);
  }, []);

  const names = [0, 1, 2].map((i) => HARNESSES[(start + i) % HARNESSES.length]).join(" + ");

  return (
    <p className="hero-line">
      <span className="sr-only">
        A lockfile for frontier orchestration: Claude Code, Codex, Antigravity, and OpenCode.
      </span>
      <span aria-hidden="true">
        A lockfile for frontier orchestration.
        {/* A new key remounts DecryptText, which decrypts once per mount. */}
        <DecryptText key={names} text={names} decryptSpeed={DECRYPT_MS} className="hero-harnesses" />
      </span>
    </p>
  );
}
