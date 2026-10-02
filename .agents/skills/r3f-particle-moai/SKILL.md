---
name: r3f-particle-moai
description: Three.js and React Three Fiber (R3F) guidelines for the hero particle moai head, shaders, particle geometry, CRT glitch post-processing, and render-loop performance budgeting.
---

# React Three Fiber Particle Moai Guidance

Use this skill when modifying, inspecting, or optimizing the 3D particle moai head in `moai-agent/website` (`src/components/Globe/`).

## Architecture

- `src/components/Globe/GlobeWithGlitch.tsx`: R3F Canvas host, camera configuration, and post-processing composer.
- `src/components/Globe/Particles.tsx`: Point cloud simulation, particle vertex/fragment shaders, and drag-rotation physics.
- `src/components/Globe/moaiGeometry.ts`: Procedural particle distribution defining the moai head silhouette and point density.
- `src/components/Globe/GlitchEffect.tsx`: Custom CRT analog glitch post-processing shader pass.

## Key Constraints

1. **Offscreen Rendering Pause**: The particle simulation and R3F render loop must pause when the hero scrolls out of view (via IntersectionObserver). Do not consume GPU cycles on offscreen sections.
2. **Reduced Motion**: Honor `prefers-reduced-motion: reduce`. When active, particle agitation and glitch displacement must be dampened or disabled.
3. **Black Canvas Isolation**: The particle head lives only in the hero section. Do not leak canvas elements or background glow into subsequent session steps.
4. **Build & Type Checking**: Verify that any shader parameter changes, Drei helper hooks, or Three.js imports compile cleanly with `bun run lint` (`tsc --noEmit`).
