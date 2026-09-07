"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
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

function Scene() {
  const mousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const prevMousePos = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseDelta = useRef(new THREE.Vector2(0, 0));
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
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

      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0}
        zoomSpeed={1}
      />
      <Particles {...PARTICLE_CONFIG} />
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

export default function GlobeWithGlitch() {
  return (
    <Canvas
      style={{ height: "100%" }}
      camera={{ fov: 25, position: [0, 0, 6] }}
    >
      <Scene />
    </Canvas>
  );
}
