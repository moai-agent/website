"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS, type Line } from "./transcript";

/*
 * Wide screens get one sticky terminal that plays the session as each note
 * crosses the middle of the viewport. Narrow screens get each excerpt inline
 * under its note. CSS shows exactly one of the two, so assistive tech never
 * reads the transcript twice.
 */

function TermLines({ lines, typed }: { lines: Line[]; typed?: number }) {
  return (
    <>
      {lines.map((line, i) => {
        if (line.kind === "gap") return <span key={i} className="term-line" aria-hidden="true">{"\n"}</span>;
        const text =
          line.kind === "cmd" && typed !== undefined ? line.text.slice(0, typed) : line.text;
        // Wrap only between arguments: each run of non-space characters stays whole.
        const words = text.split(/(\s+)/).map((w, j) =>
          /^\s+$/.test(w) || w === "" ? w : <span key={j} className="term-word">{w}</span>,
        );
        return (
          <span key={i} className={`term-line term-${line.kind}`}>
            {line.kind === "cmd" && <span className="term-prompt">$ </span>}
            {words}
            {"\n"}
          </span>
        );
      })}
    </>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function Session() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(Infinity);
  const reduced = useReducedMotion();
  const noteRefs = useRef<(HTMLElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of noteRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  // Type the active step's command; its output lands once the line is done.
  useEffect(() => {
    const command = STEPS[active].lines.find((l) => l.kind === "cmd")?.text;
    if (reduced || !command) {
      setTyped(Infinity);
      return;
    }
    setTyped(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 2;
      setTyped(n);
      if (n >= command.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [active, reduced]);

  useEffect(() => {
    const screen = screenRef.current;
    const block = blockRefs.current[active];
    if (!screen || !block) return;
    const bottom = block.offsetTop + block.offsetHeight - screen.clientHeight + 24;
    screen.scrollTo({ top: Math.max(0, bottom), behavior: reduced ? "auto" : "smooth" });
  }, [active, typed, reduced]);

  const command = STEPS[active].lines.find((l) => l.kind === "cmd")?.text ?? "";
  const typing = typed < command.length;

  return (
    <section className="session" aria-label="An ahu session">
      <div className="session-term-col">
        <div className={`term term-sticky ${STEPS[active].id === "drift" ? "is-cracked" : ""}`}>
          <img className="term-crack" src="/media/cracked-glass.webp" alt="" aria-hidden="true" />
          <div className="term-bar">
            <span>~/github.com/moai-agent/ahu</span>
            <span>ahu v0.4.0 · real output, trimmed</span>
          </div>
          <div className="term-screen" ref={screenRef}>
            <pre>
              {STEPS.map((step, i) =>
                i > active ? null : (
                  <div
                    key={step.id}
                    ref={(el) => {
                      blockRefs.current[i] = el;
                    }}
                    className={`term-block ${i === active ? "is-active" : "is-past"} ${i === active && typing ? "is-typing" : ""}`}
                  >
                    <TermLines lines={step.lines} typed={i === active ? typed : undefined} />
                    {i === active && <span className="term-caret" aria-hidden="true" />}
                  </div>
                ),
              )}
            </pre>
          </div>
        </div>
      </div>

      <ol className="session-notes">
        <li className="session-provenance">Real output from ahu v0.4.0, trimmed.</li>
        {STEPS.map((step, i) => (
          <li
            key={step.id}
            data-step={i}
            ref={(el) => {
              noteRefs.current[i] = el;
            }}
            className={`note ${i === active ? "is-active" : ""}`}
          >
            <h2>{step.heading}</h2>
            <p>{step.note}</p>
            <div className={`term term-inline ${step.id === "drift" ? "is-cracked" : ""}`}>
              {step.id === "drift" && (
                <img className="term-crack" src="/media/cracked-glass.webp" alt="" aria-hidden="true" loading="lazy" />
              )}
              <pre>
                <TermLines lines={step.lines} />
              </pre>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
