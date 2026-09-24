"use client";

import { useEffect, useState } from "react";
import { STEPS } from "./transcript";

const SECTIONS = [
  { id: "top", label: "ahu" },
  ...STEPS.map((s) => ({ id: s.id, label: s.label })),
  { id: "network", label: "Network" },
  { id: "install", label: "Install" },
];

/** or13.io-style section dots on the right edge. */
export default function SectionDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          setActive(id);
          // Keep the address bar on the section in view, so any moment is shareable.
          // replaceState, not pushState: scrolling should not fill the back button.
          const hash = id === "top" ? "" : `#${id}`;
          if (window.location.hash !== hash) {
            history.replaceState(null, "", hash || window.location.pathname + window.location.search);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav className="dots" aria-label="Sections">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`dot ${active === s.id ? "is-active" : ""}`}
          aria-label={s.label}
          aria-current={active === s.id ? "true" : undefined}
        >
          <span className="dot-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
