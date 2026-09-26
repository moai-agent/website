"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import FrameTerminal from "./FrameTerminal";
import StepTerminal from "./StepTerminal";
import type { Step, Variant } from "./transcript";

/** Remembered across steps and visits so a Codex user keeps seeing Codex. */
const STORAGE_KEY = "ahu:harness";
/** The harness the step's note names, shown until the viewer picks another. */
const DEFAULT_ID = "codex";

/**
 * A step shown as each coordinating harness renders it, framed as a cmux window:
 * its tab strip is the picker, one tab per harness. Switching remounts the
 * terminal so it replays.
 */
export default function HarnessTerminal({ step, variants }: { step: Step; variants: Variant[] }) {
  const [id, setId] = useState(DEFAULT_ID);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && variants.some((v) => v.id === saved)) setId(saved);
    } catch {}
  }, [variants]);

  // Only a real choice between harnesses is worth remembering.
  const pick = (next: string) => {
    setId(next);
    if (variants.length < 2) return;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const active = variants.find((v) => v.id === id) ?? variants[0];

  const stepId = (v: Variant) => `${step.id}-${v.id}`;

  // Arrow keys move between tabs, as in any tablist.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const i = variants.indexOf(active);
    const next = variants[(i + delta + variants.length) % variants.length];
    pick(next.id);
    document.getElementById(`${stepId(next)}-tab`)?.focus();
  };

  return (
    <div className="harness">
      <div className="harness-tabs" role="tablist" aria-label="Coordinating harness" onKeyDown={onKeyDown}>
        {variants.map((v) => (
          <button
            key={v.id}
            id={`${stepId(v)}-tab`}
            type="button"
            role="tab"
            aria-selected={v === active}
            aria-controls={`${step.id}-panel`}
            tabIndex={v === active ? 0 : -1}
            className="harness-tab"
            onClick={() => pick(v.id)}
          >
            <TerminalIcon />
            <span className="harness-tab-title">{v.label}</span>
            {v === active && (
              <span className="harness-tab-close" aria-hidden="true">
                ×
              </span>
            )}
          </button>
        ))}
        <span className="harness-tools" aria-hidden="true">
          <TerminalIcon />
          <GlobeIcon />
          <SplitIcon vertical />
          <SplitIcon />
        </span>
      </div>
      <div id={`${step.id}-panel`} role="tabpanel" aria-labelledby={`${stepId(active)}-tab`}>
        {active.frames ? (
          <FrameTerminal
            key={active.id}
            frames={active.frames}
            label={step.heading}
            screen={active.screen}
            cols={active.cols}
          />
        ) : (
          <StepTerminal key={active.id} step={step} lines={active.lines} prompt={active.prompt} native />
        )}
      </div>
    </div>
  );
}

/* cmux's tab-bar glyphs, drawn small and in the tab's own colour. */
function TerminalIcon() {
  return (
    <svg className="harness-icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
      <path d="M4.5 6.5 6.5 8l-2 1.5M8 10h3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="harness-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" />
    </svg>
  );
}

function SplitIcon({ vertical = false }: { vertical?: boolean }) {
  return (
    <svg className="harness-icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
      <path d={vertical ? "M8 2.5v11" : "M1.5 8h13"} />
    </svg>
  );
}
