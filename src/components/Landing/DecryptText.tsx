"use client";

/*
 * Ported from or13.io (src/components/Aesthetic/DecryptText.tsx) with two
 * changes: the root is a <span> so it can sit inside a paragraph, and the
 * idle state reserves the text's space (hidden) instead of rendering nothing,
 * so the line does not jump before the first decrypt. It runs once per mount:
 * give it a new `key` to decrypt a new value.
 */

import { useEffect, useRef, useState, useCallback } from "react";

const CIPHER_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

function randomCipher() {
  return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
}

type DecryptTextProps = {
  text: string;
  decryptSpeed?: number;
  className?: string;
};

export default function DecryptText({ text, decryptSpeed = 40, className }: DecryptTextProps) {
  const [display, setDisplay] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle" | "scrambling" | "done">("idle");
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const run = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const chars = text.split("");
    const len = chars.length;

    // Fill all positions at once — spaces stay as spaces for stable wrapping
    const scrambled = chars.map((ch) => (ch === " " ? " " : randomCipher()));
    setDisplay([...scrambled]);
    setPhase("scrambling");

    // Resolve characters in waves — stagger by position but keep total time short
    const resolved = new Array<boolean>(len).fill(false);
    // Max delay scales with length but caps at ~1.5s total
    const maxDelay = Math.min(Math.ceil(len * 0.3), 30);
    const delays = chars.map((ch) => (ch === " " ? 0 : Math.floor(Math.random() * maxDelay) + 2));
    let tick = 0;

    timer.current = window.setInterval(() => {
      tick++;
      let allDone = true;

      for (let i = 0; i < len; i++) {
        if (resolved[i]) continue;
        if (chars[i] === " ") {
          resolved[i] = true;
          continue;
        }
        if (tick >= delays[i] + 3) {
          // Resolve
          scrambled[i] = chars[i];
          resolved[i] = true;
        } else if (tick >= delays[i]) {
          // Quick flicker before resolve
          scrambled[i] = randomCipher();
          allDone = false;
        } else {
          // Slow scramble while waiting
          if (Math.random() > 0.7) {
            scrambled[i] = randomCipher();
          }
          allDone = false;
        }
      }

      setDisplay([...scrambled]);

      if (allDone) {
        window.clearInterval(timer.current);
        setPhase("done");
      }
    }, decryptSpeed);
  }, [text, decryptSpeed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setPhase("done");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer.current);
    };
  }, [run, text]);

  return (
    <span ref={containerRef} className={className}>
      <span className="decrypt-text">
        {phase === "done" ? (
          text
        ) : phase === "idle" ? (
          <span className="decrypt-idle">{text}</span>
        ) : (
          display.map((char, i) => (
            <span key={i} className={char === text[i] ? "decrypt-resolved" : "decrypt-scramble"}>
              {char}
            </span>
          ))
        )}
      </span>
    </span>
  );
}
