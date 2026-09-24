"use client";

import { useEffect, useRef } from "react";

/**
 * A muted background loop that loads nothing until it is active and on
 * screen, and pauses otherwise. Reduced-motion visitors get the still poster.
 */
export default function LoopVideo({
  name,
  className,
  active = true,
}: {
  name: string;
  className?: string;
  /** Inactive loops stay paused (and unloaded until first played). */
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current!;
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [active]);

  return (
    <video
      ref={ref}
      className={className}
      poster={`/media/${name}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`/media/${name}.webm`} type="video/webm" />
      <source src={`/media/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
