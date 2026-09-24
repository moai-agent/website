"use client";

import { useEffect, useRef } from "react";
import GlobeLoader from "@/components/Globe/GlobeLoader";

/**
 * The particle moai, fixed behind the page. It dims as the session scrolls
 * up over it so the transcript never competes with the particles.
 */
export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const t = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      ref.current?.style.setProperty("--backdrop-dim", String(1 - t * 0.85));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      <GlobeLoader backdrop controlsSelector=".hero" />
    </div>
  );
}
