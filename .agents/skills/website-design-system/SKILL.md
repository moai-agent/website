---
name: website-design-system
description: Design system rules, color tokens (OKLCH phosphor neutrals and signal hues), typography, and strict 4.5:1 p99 background contrast verification for moai-agent.com.
---

# Website Design System Guidance

Use this skill when modifying, reviewing, or verifying visual styles, components, typography, and layouts in `moai-agent/website`.

## North Star: "The Session in the Dark"

The site is a stone head made of light, followed by an illustrative terminal session rendered in phosphor neutrals on a pure black ground. Density is low: each concept occupies a full viewport of scroll with a short mono heading, one Lexend sentence, and an illustrative interactive session.

## Color Tokens (OKLCH)

Authored in OKLCH (see `DESIGN.md`):
- `ground`: `#000000` (Pure black background; not a theme, an absolute canvas)
- `panel`: `oklch(0.12 0.004 228.8)` (Terminal and code box backgrounds)
- `rule`: `oklch(0.275 0.011 216.9)` (Hairline dividers, borders, muted controls)
- `bone`: `oklch(0.96 0.003 205)` (Primary text, active button fill, high-emphasis headings)
- `ash`: `oklch(0.72 0.016 213.5)` (Secondary text, notes, inactive section dots)
- `dim`: `oklch(0.58 0.017 213.2)` (Tertiary text, terminal title bars, metadata)

Signal hues have fixed semantic meanings and must not be used decoratively:
- `signal-red`: `oklch(0.68 0.19 28)` (User prompts, error states, warnings)
- `handle-blue`: `oklch(0.76 0.11 250)` (Agent handles `@agent`, focus rings, active section dot)

## Typography

- **Headings & Terminals**: `Atkinson Hyperlegible Mono, ui-monospace, monospace`
  - Display: `clamp(4.5rem, 14vw, 6rem)`, weight 700, letterSpacing 0.12em
  - Headline: `clamp(2rem, 4.4vw, 3.5rem)`, weight 700, letterSpacing 0.02em
  - Phosphor glow: Headings, buttons, and wordmarks carry subtle text glow `text-shadow: 0 0 5px`
- **Body & Prose**: `Lexend, system-ui, sans-serif`
  - Body: `1.0625rem`, weight 400, line-height 1.6
  - Lead: `clamp(1.05rem, 2.2vw, 1.35rem)`

## Strict Contrast & Legibility Rule

Every effect earns its place against legibility:
- Body text must clear **4.5:1** against the 99th-percentile luminance of the background directly behind it.
- Large text (24px+ bold) must clear **3.0:1**.
- Average pixel luminance does not count as a pass. Check behind text blocks with radial scrims or opaque panel backgrounds.

## Verification Checklist

1. `bun run --cwd /Users/orie/github.com/moai-agent/website lint` (`tsc --noEmit`) passes with zero type errors.
2. `bun run --cwd /Users/orie/github.com/moai-agent/website build` passes static export generation to `./out`.
3. If social share cards or assets changed, verify `bun run og` generates valid PNG.
