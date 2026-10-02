<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository collaboration & design instructions

This repository hosts the official landing page for `ahu` (`moai-agent.com`).
All agents operating in this repository (e.g. `@design-agy`, `@design-opus`, `@design-astra`) must follow these guidelines:

### Design & Architecture
- **Single Page Static Export**: The website is a single page statically exported (`next build --webpack` to `./out`). Do not introduce dynamic server routes or SSR requirements.
- **Design System Fidelity**: Read and adhere strictly to `DESIGN.md` and `PRODUCT.md`. All colors are defined in OKLCH phosphor neutrals and fixed signal hues (`signal-red`, `handle-blue`). Maintain square corners (`--radius: 0`) and Atkinson Hyperlegible Mono / Lexend pairings.
- **Strict Legibility & Contrast**: Body text must clear 4.5:1 against the 99th-percentile luminance of the background behind it; large text must clear 3:1.
- **Particle Head**: The Three.js / React Three Fiber particle moai head lives in the hero. Render loops must pause when scrolled offscreen. Honor `prefers-reduced-motion`.

### Synthetic Content & Privacy Boundary
- All terminal walkthroughs (`transcript.ts`) and registry maps (`registry.ts`) contain illustrative, synthetic data.
- NEVER commit real machine paths, execution traces, personal identifiers, or private roadmap issue context to this repository.

### Build Verification
Always run and verify before submitting changes:
```bash
bun run lint   # tsc --noEmit
bun run build  # generate-og.tsx + next build
```
