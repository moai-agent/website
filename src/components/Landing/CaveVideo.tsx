"use client";

import { useEffect, useRef } from "react";

/**
 * The underground cave behind the close. It only loads and plays while in
 * view, and reduced-motion visitors get the still poster.
 */
export default function CaveVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="close-video"
      poster="/media/underground-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/media/underground.webm" type="video/webm" />
      <source src="/media/underground.mp4" type="video/mp4" />
    </video>
  );
}
