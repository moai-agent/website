"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Particles } from "./Particles";
import { EffectComposer } from "@react-three/postprocessing";
import { GlitchEffect } from "./GlitchEffect";

const DARK_BG = "#000000";

const PARTICLE_CONFIG = {
  focus: 6,
  speed: 10,
  aperture: 5,
  fov: 100,
  curl: 0.7,
};

const GLITCH_CONFIG = {
  enabled: true,
  cursorRadius: .5,
  cursorIntensity: 10,
  distortionAmount: 0.5,
  colorShiftAmount: 0.5,
  fadeSpeed: 0.5,
  pixelSize: 1,
  pixelationFadeSpeed: .1,
};

/*
 * The FBO is a size x size grid, so particle count is the square: 512 gives
 * 262k points, each running a depth-of-field blur in the fragment shader.
 * That is fine on a desktop GPU and far too much for a phone.
 */
function particleGridSize() {
  if (typeof window === "undefined") return 512;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 640;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return narrow || coarse ? 256 : 512;
}

function Scene({
  gridSize,
  backdrop,
  controlsSelector,
}: {
  gridSize: number;
  backdrop: boolean;
  controlsSelector?: string;
}) {
  const aspect = useThree((state) => state.size.width / state.size.height);
  const headScale = Math.min(1, aspect / 0.7);
  const mousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const prevMousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseDelta = useRef(new THREE.Vector2(0, 0));
  const isMouseDown = useRef(false);
  const [controlsEl, setControlsEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (controlsSelector) setControlsEl(document.querySelector<HTMLElement>(controlsSelector));
  }, [controlsSelector]);

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("pointercancel", handleMouseUp);

    return () => {
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("pointercancel", handleMouseUp);
    };
  }, []);

  useFrame((state) => {
    const mouse = state.mouse;
    prevMousePos.current.copy(mousePos.current);
    mousePos.current.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);

    if (isMouseDown.current) {
      mouseDelta.current.subVectors(mousePos.current, prevMousePos.current);
    } else {
      mouseDelta.current.set(0, 0);
    }
  });

  return (
    <>
      <color attach="background" args={[DARK_BG]} />
      <fog attach="fog" args={[DARK_BG, 50, 50]} />

      {!backdrop && (
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0}
          zoomSpeed={1}
        />
      )}
      {/*
       * Behind scrolling content the head rotates from a stand-in element
       * instead of the canvas. Zoom stays off so the wheel keeps scrolling.
       */}
      {backdrop && controlsEl && (
        <OrbitControls
          makeDefault
          domElement={controlsEl}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
        />
      )}
      <Particles {...PARTICLE_CONFIG} size={gridSize} scale={headScale} />
      {GLITCH_CONFIG.enabled && (
        <EffectComposer>
          <GlitchEffect
            mousePos={mousePos.current}
            mouseDelta={mouseDelta.current}
            isMouseDown={isMouseDown.current}
            config={GLITCH_CONFIG}
          />
        </EffectComposer>
      )}
    </>
  );
}

/*
 * `backdrop` renders the head behind page content: the canvas takes no pointer
 * events itself, so the pointer is read from the whole document instead.
 */
export default function GlobeWithGlitch({
  backdrop = false,
  controlsSelector,
  paused = false,
}: {
  backdrop?: boolean;
  /** In backdrop mode, the element whose drags rotate the head. */
  controlsSelector?: string;
  /** Stop rendering, e.g. while the canvas is scrolled out of view. */
  paused?: boolean;
}) {
  // Read once on mount; resizing between phone and desktop dimensions mid-session
  // is not worth rebuilding the FBO for.
  const [gridSize] = useState(particleGridSize);

  return (
    <Canvas
      style={{ height: "100%", ...(backdrop && { pointerEvents: "none" }) }}
      eventSource={backdrop ? document.documentElement : undefined}
      eventPrefix={backdrop ? "client" : undefined}
      frameloop={paused ? "never" : "always"}
      camera={{ fov: 25, position: [0, 0, 6] }}
      dpr={[1, 1.5]}
    >
      <Scene gridSize={gridSize} backdrop={backdrop} controlsSelector={controlsSelector} />
    </Canvas>
  );
}
