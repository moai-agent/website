"use client";

import { useEffect, useRef, useState } from "react";
import GlobeLoader from "@/components/Globe/GlobeLoader";

/**
 * The particle moai lives only in the hero. It stops rendering once the hero
 * scrolls out of view, so the rest of the page costs no GPU time.
 */
export default function HeroMoai() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="hero-moai" aria-hidden="true">
      <GlobeLoader backdrop controlsSelector=".hero" paused={paused} />
    </div>
  );
}
