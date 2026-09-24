"use client";

import dynamic from "next/dynamic";

const GlobeWithGlitch = dynamic(() => import("./GlobeWithGlitch"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#000000" }} />
  ),
});

export default function GlobeLoader({
  backdrop = false,
  controlsSelector,
  paused,
}: {
  backdrop?: boolean;
  controlsSelector?: string;
  paused?: boolean;
}) {
  return <GlobeWithGlitch backdrop={backdrop} controlsSelector={controlsSelector} paused={paused} />;
}
