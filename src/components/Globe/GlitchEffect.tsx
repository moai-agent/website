"use client";

import { forwardRef, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { Effect } from "postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { GPUComputationRenderer } from "three-stdlib";

// Compute shader for flow map simulation
const computeShader = `
  uniform vec2 uCursorPosition;
  uniform vec2 uCursorDelta;
  uniform float uCursorRadius;
  uniform float uCursorIntensity;
  uniform float uFadeSpeed;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 currentState = texture2D(uFlowMap, uv);

    float dist = distance(uv, uCursorPosition);
    float influence = smoothstep(uCursorRadius, 0.0, dist);
    vec2 newFlow = uCursorDelta * uCursorIntensity * influence;

    currentState.rg = currentState.rg * uFadeSpeed + newFlow;

    gl_FragColor = currentState;
  }
`;

// Fragment shader for the glitch effect with pixelation
const fragmentShader = `
  uniform sampler2D uFlowMap;
  uniform float uDistortionAmount;
  uniform float uColorShiftAmount;
  uniform float uPixelSize;
  uniform vec2 uResolution;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate pixel size for grid snapping
    vec2 pixelSize = vec2(uPixelSize) / uResolution;

    // Apply pixelation to UV coordinates
    vec2 pixelatedUv = uv;
    if (uPixelSize > 1.0) {
      pixelatedUv = floor(uv / pixelSize) * pixelSize + pixelSize * 0.5;
    }

    // Sample flow map
    vec4 flowData = texture2D(uFlowMap, uv);

    // Stronger quantization for more pronounced pixelation
    if (uPixelSize > 1.0) {
      flowData.rg = floor(flowData.rg * 16.0) / 16.0;
    }

    // Apply distortion based on flow map
    vec2 distortion = flowData.rg * uDistortionAmount;
    vec2 distortedUv = pixelatedUv + distortion;

    // RGB shift for chromatic aberration
    vec2 rUv = distortedUv + vec2(uColorShiftAmount * flowData.r, 0.0);
    vec2 bUv = distortedUv - vec2(uColorShiftAmount * flowData.r, 0.0);

    // Apply pixelation to RGB sample positions when active
    if (uPixelSize > 1.0) {
      rUv = floor(rUv / pixelSize) * pixelSize + pixelSize * 0.5;
      bUv = floor(bUv / pixelSize) * pixelSize + pixelSize * 0.5;
      distortedUv = floor(distortedUv / pixelSize) * pixelSize + pixelSize * 0.5;
    }

    // Sample colors with pixelation
    float r = texture2D(inputBuffer, rUv).r;
    float g = texture2D(inputBuffer, distortedUv).g;
    float b = texture2D(inputBuffer, bUv).b;

    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

// Custom Effect class
class GlitchEffectImpl extends Effect {
  constructor({
    distortionAmount = 0.03,
    colorShiftAmount = 0.3,
    pixelSize = 4.0,
    resolution = new THREE.Vector2(1024, 1024)
  } = {}) {
    super("GlitchEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ["uFlowMap", new THREE.Uniform(null)],
        ["uDistortionAmount", new THREE.Uniform(distortionAmount)],
        ["uColorShiftAmount", new THREE.Uniform(colorShiftAmount)],
        ["uPixelSize", new THREE.Uniform(pixelSize)],
        ["uResolution", new THREE.Uniform(resolution)],
      ]),
    });
  }
}

interface GlitchEffectProps {
  mousePos: THREE.Vector2;
  mouseDelta: THREE.Vector2;
  isMouseDown: boolean;
  config: {
    cursorRadius: number;
    cursorIntensity: number;
    distortionAmount: number;
    colorShiftAmount: number;
    fadeSpeed: number;
    pixelSize?: number;
    pixelationFadeSpeed?: number;
  };
}

export const GlitchEffect = forwardRef<any, GlitchEffectProps>(
  ({ mousePos, mouseDelta, isMouseDown, config }, ref) => {
    const { gl, size } = useThree();
    const gpuComputer = useRef<GPUComputationRenderer | null>(null);
    const computeVariable = useRef<any>(null);
    const effectRef = useRef<GlitchEffectImpl | null>(null);
    const initialized = useRef(false);
    const pixelationStrength = useRef(1.0);

    const effect = useMemo(
      () =>
        new GlitchEffectImpl({
          distortionAmount: config.distortionAmount,
          colorShiftAmount: config.colorShiftAmount,
          pixelSize: config.pixelSize || 4.0,
          resolution: new THREE.Vector2(size.width, size.height),
        }),
      []
    );

    useEffect(() => {
      effectRef.current = effect;
    }, [effect]);

    // Initialize GPU computation once
    useEffect(() => {
      if (!gl || initialized.current) return;

      try {
        const computeSize = 32;
        const computeRenderer = new GPUComputationRenderer(
          computeSize,
          computeSize,
          gl
        );

        const initialState = computeRenderer.createTexture();
        const dataArray = initialState.image.data as Float32Array;
        for (let i = 0; i < dataArray.length; i += 4) {
          dataArray[i] = 128;
          dataArray[i + 1] = 128;
          dataArray[i + 2] = 128;
          dataArray[i + 3] = 255;
        }

        const variable = computeRenderer.addVariable(
          "uFlowMap",
          computeShader,
          initialState
        );

        variable.material.uniforms = {
          uCursorPosition: { value: new THREE.Vector2(0.5, 0.5) },
          uCursorDelta: { value: new THREE.Vector2(0, 0) },
          uCursorRadius: { value: config.cursorRadius },
          uCursorIntensity: { value: config.cursorIntensity },
          uFadeSpeed: { value: config.fadeSpeed },
        };

        computeRenderer.setVariableDependencies(variable, [variable]);
        const error = computeRenderer.init();

        if (error !== null) {
          console.error("GPU Computation initialization error:", error);
          return;
        }

        gpuComputer.current = computeRenderer;
        computeVariable.current = variable;
        initialized.current = true;
      } catch (error) {
        console.error("Failed to initialize GPU computation:", error);
      }

      return () => {
        if (gpuComputer.current) {
          gpuComputer.current.dispose();
          initialized.current = false;
        }
      };
    }, [gl, config.cursorRadius, config.cursorIntensity, config.fadeSpeed]);

    // Update uniforms on every frame
    useFrame((state) => {
      if (gpuComputer.current && computeVariable.current && effectRef.current) {
        try {
          computeVariable.current.material.uniforms.uCursorPosition.value.copy(
            mousePos
          );
          computeVariable.current.material.uniforms.uCursorDelta.value.copy(
            mouseDelta
          );
          computeVariable.current.material.uniforms.uCursorRadius.value =
            config.cursorRadius;
          computeVariable.current.material.uniforms.uCursorIntensity.value =
            config.cursorIntensity;
          computeVariable.current.material.uniforms.uFadeSpeed.value =
            config.fadeSpeed;

          gpuComputer.current.compute();

          const targetPixelation = isMouseDown ? 1.0 : 0.0;
          const fadeSpeed = config.pixelationFadeSpeed || 0.05;
          pixelationStrength.current = THREE.MathUtils.lerp(
            pixelationStrength.current,
            targetPixelation,
            fadeSpeed
          );

          const flowTexture = gpuComputer.current.getCurrentRenderTarget(
            computeVariable.current
          ).texture;

          effectRef.current.uniforms.get("uFlowMap")!.value = flowTexture;
          effectRef.current.uniforms.get("uDistortionAmount")!.value =
            config.distortionAmount;
          effectRef.current.uniforms.get("uColorShiftAmount")!.value =
            config.colorShiftAmount;

          const currentPixelSize = 1.0 + (config.pixelSize || 4.0 - 1.0) * pixelationStrength.current;
          effectRef.current.uniforms.get("uPixelSize")!.value = currentPixelSize;

          effectRef.current.uniforms.get("uResolution")!.value.set(
            state.size.width,
            state.size.height
          );
        } catch (error) {
          console.error("Error updating glitch effect:", error);
        }
      }
    });

    return <primitive ref={ref} object={effect} />;
  }
);

GlitchEffect.displayName = "GlitchEffect";
