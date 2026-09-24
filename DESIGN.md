---
name: moai-agent / ahu
description: One real ahu terminal session, played over a particle moai on a black ground.
colors:
  signal-red: "oklch(0.68 0.19 28)"
  handle-blue: "oklch(0.76 0.11 250)"
  ground: "#000000"
  panel: "#0a0a0b"
  rule: "#242427"
  bone: "#ece8e1"
  ash: "#a3a1a8"
  dim: "#7b7980"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 14vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
  headline:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)"
    fontWeight: 400
  body:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  label:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  wordmark-label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0.2em"
  mono:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  caption:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  focus: "2px"
  panel: "8px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  column-gap: "clamp(32px, 5vw, 80px)"
  inline-gap: "8px"
  stack-sm: "16px"
  stack-md: "40px"
  stack-lg: "56px"
  panel-inset: "16px 18px"
  content-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ground}"
  button-ghost:
    backgroundColor: "rgb(0 0 0 / 0.55)"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    typography: "{typography.label}"
  command-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.bone}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-inset}"
    typography: "{typography.mono}"
  terminal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ash}"
    rounded: "{rounded.panel}"
    padding: "16px 18px 24px"
    typography: "{typography.mono}"
  terminal-bar:
    textColor: "{colors.dim}"
    padding: "10px 16px"
  margin-note:
    textColor: "{colors.ash}"
    width: "36ch"
    typography: "{typography.body}"
---

# Design System: moai-agent / ahu

Scope: this records the site's only page, `/` (`src/app/page.tsx`, `src/components/Landing/`, fonts in `src/app/layout.tsx`, glitch keyframes in `src/app/globals.css`). The site stays a single page.

## Overview

**Creative North Star: "The Session in the Dark"**

The page is one terminal session held up in front of a stone head made of light. Black is the ground, not a theme; everything that speaks is either bone-white prose or monospace output that ahu really printed. The particle moai owns the first viewport at full brightness, then recedes to about 15% as the session scrolls over it, so the transcript never competes with the particles.

Density is deliberately low. Each idea gets a whole viewport of scroll: a short Atkinson Hyperlegible heading, one Lexend sentence, and the command that proves it. On wide screens a single sticky terminal types each command as its margin note reaches the middle of the viewport; on narrow screens each note carries its own excerpt inline. There are no cards, no feature grids, and no decorative illustration. The only colour is signal: red for the prompt and warnings, blue for agent handles.

The CRT tear on the `ahu` wordmark is the one place the page glitches. It stays intermittent (a 4s cycle that bursts through its first 20% and holds closed) so it reads as signal loss, not noise.

**Key Characteristics:**
- Pure black ground with a fixed particle moai backdrop that dims on scroll.
- Bone-white Atkinson Hyperlegible headings, Lexend prose, Atkinson Hyperlegible Mono terminal.
- Two signal colours only, each with a fixed meaning.
- Hairline-bordered dark panels for anything that is terminal output; nothing else is boxed.
- Pill-shaped links; one filled bone pill as the single call to action.
- Motion is scroll-driven and slow-settling on one expo-out curve, and every animation has a reduced-motion off switch.

## Colors

A near-achromatic ground-to-bone ramp with two saturated signal hues that mean something every time they appear.

### Primary
- **Signal Red** (signal-red): the shell prompt `$`, warning lines in the transcript (drift, missing context), the red fringe of the wordmark tear, and text selection (at 45% alpha). It marks "this is the command" or "this needs your attention."

### Secondary
- **Handle Blue** (handle-blue): agent handles and keys in terminal output (`@dev-agy 1.0.0`) and the focus ring. It marks identity: a named thing you can address.

### Neutral
- **Ground** (ground): the page background, the footer, the browser theme colour. Pure black, so the particles read as light.
- **Panel** (panel): terminal and install-command surfaces. One step off black, just enough to hold a hairline.
- **Rule** (rule): every hairline: panel borders, the terminal title-bar divider, the ghost pill border, the footer top rule, the copy-button divider.
- **Bone** (bone): headings, the hero line, typed commands, the terminal caret, and the filled call-to-action pill. Warm off-white, never pure white for text.
- **Ash** (ash): prose in the margin notes, terminal output lines, secondary labels (wordmark label, scroll cue). 7.7:1 on panel.
- **Dim** (dim): the quietest legible text: terminal title bar, provenance line, footer. 4.6:1 on panel is its floor; nothing dimmer carries words.

### Named Rules
**The Two Signals Rule.** Red means prompt or warning; blue means an agent's name or keyboard focus. Neither is ever used as decoration, fill, or a section tint.

**The Bone Not White Rule.** Text is bone. Pure white appears only as the hover brightening of the bone pill and in selected text.

## Typography

**Display Font:** Atkinson Hyperlegible 700 (with system-ui)
**Body Font:** Lexend 400 (with system-ui)
**Label/Mono Font:** Atkinson Hyperlegible Mono (with ui-monospace)

**Character:** A legibility-first pairing: Atkinson's open, slightly idiosyncratic letterforms give headings a plain-spoken voice, Lexend keeps prose airy, and the Atkinson mono cut ties the terminal to the headings. Fonts load through `next/font` as the CSS variables `--font-heading`, `--font-sans` and `--font-mono`.

### Hierarchy
- **Display** (700, clamp(4.5rem, 14vw, 6rem), line-height 1, tracking 0.12em with a matching text-indent so it centres optically): the `ahu` wordmark only, carrying the RGB tear.
- **Headline** (700, clamp(2.25rem, 5vw, 4rem), 1.05, -0.02em, max 18ch): the closing call ("It's early. Try it.").
- **Title** (700, clamp(1.75rem, 2.8vw, 2.5rem), 1.12, -0.01em, balanced wrap): one per margin note.
- **Lead** (400, clamp(1.05rem, 2.2vw, 1.35rem), balanced wrap): the single line under the wordmark.
- **Body** (400, 1.0625rem, 1.6, pretty wrap, max 36ch beside the terminal, 44ch when stacked): margin-note sentences, in ash.
- **Body small** (400, 0.9375rem, max 60ch): requirements line under the install command.
- **Label** (400, 0.875rem): top-bar link, scroll cue, button text.
- **Wordmark label** (Atkinson 400, 0.875rem, 0.2em tracking, ash): the `moai-agent` name in the top bar.
- **Mono** (400, 0.8125rem, 1.6, tabular numerals): terminal output; 0.875rem in the install field, 0.75rem in the terminal title bar and inline mobile excerpts.
- **Caption** (400, 0.8125rem, dim): footer and provenance.

### Named Rules
**The Real Output Rule.** Monospace is reserved for text ahu actually prints or a command a person actually types. Never set prose, headings, or labels in mono to look technical.

**The Unbroken Argument Rule.** Terminal lines wrap only between arguments; a path, URL or flag never splits mid-token. Wrapped lines hang-indent 4ch under the prompt.

## Layout

A single scrolling column framed by a fluid gutter (clamp(16px, 4vw, 48px)) with content capped at 1320px.

- **Hero:** exactly one small viewport tall (100svh), centred wordmark and line, top bar absolutely positioned over it, scroll cue pinned to the bottom (respecting the safe-area inset). The hero and top bar pass pointer events through to the moai canvas; only links take the pointer.
- **Session:** a two-column grid, terminal 3fr and notes 2fr, gap clamp(32px, 5vw, 80px). The terminal is sticky at 12vh from the top and 76vh tall; each note is 88vh tall with its content vertically centred, so one note is "active" at a time (observed at the middle 10% of the viewport).
- **Close:** generous air above (clamp(120px, 22vh, 220px)) and below (clamp(96px, 16vh, 160px)); headline, then 40px, install field (max 760px), 16px, requirements, 56px, call-to-action pill.
- **Footer:** one row, name left and GitHub right, hairline top rule.
- **Below 900px:** the grid collapses to a single column, the sticky terminal is removed, each note loses its fixed height (72px vertical padding) and shows its own inline excerpt, and the install field stacks with the copy button below it. CSS shows exactly one of the two transcripts so assistive tech never reads it twice.

**The One Idea Per Viewport Rule.** On wide screens each step of the story gets a full viewport of scroll and a single heading plus one sentence. Add a step, not a paragraph.

## Elevation & Depth

Flat surfaces over a luminous backdrop. Depth comes from the moai behind the page and from opacity, not from stacked shadows: the backdrop dims from 1 to 0.15 over the first 90% of a viewport of scroll, past terminal blocks fade to 45%, inactive notes to 35%.

### Shadow Vocabulary
- **Terminal lift** (`box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.9)`): the sticky terminal only, so it separates from the dimmed particles.
- **Hero legibility halo** (`text-shadow: 0 2px 32px rgb(0 0 0 / 0.9)` on the wordmark, `0 1px 18px rgb(0 0 0 / 0.95)` on the line) plus a blurred radial black scrim behind the hero text: keeps type readable over the brightest particles. These are dark halos, never glows.

### Named Rules
**The Light Comes From Behind Rule.** The only light source is the particle moai. Surfaces never glow, and shadows are black, used only to hold text or the terminal off the particles.

## Shapes

Soft-cornered panels (8px) for terminal output and the install field, full pills (999px) for links that leave the page, and hairline 1px borders in rule grey. The install field's copy button shares the field's corner on its outer edge (0 8px 8px 0, or 0 0 8px 8px when stacked) so the pair reads as one object. Focus rings are 2px handle blue, offset 3px, with a 2px corner.

## Components

### Buttons
Quiet and direct: pills that point at GitHub.
- **Shape:** full pill (999px).
- **Primary (call to action):** filled bone with black text, 16px 24px, 500 weight, GitHub mark before and arrow after. One per page, in the close.
- **Hover / Focus:** background brightens to white and the arrow gap opens from 12px to 18px over 300ms on the expo-out curve; focus is the shared blue ring.
- **Ghost (top bar):** 55% black over the moai with a rule-grey hairline, 8px 14px, GitHub mark plus label; hover turns the border bone over 200ms.
- **Copy (inside the install field):** transparent, hairline divider, label swaps to "Copied" or "Select and copy" for 2s with a polite live-region announcement; hover fills to a near-panel grey.

### Inputs / Fields
- **Install command field:** a panel-coloured, 8px, hairline-bordered mono row: red `$ `, the command (breaking only between arguments), and the copy button. Not an editable input; it is a copyable command.

### Navigation
- **Top bar:** absolutely positioned over the hero, 18px vertical padding at the gutter. Wordmark label left in ash; ghost GitHub pill right. There is no other navigation; the scroll cue ("Watch a session" with a down arrow that nudges 4px every 2.4s) is the only in-page link.

### Terminal (signature)
The page's proof surface. Panel background, hairline border, 8px corner, mono 0.8125rem at 1.6.
- **Title bar:** 0.75rem dim, repo path left, "real output, trimmed" right, hairline below.
- **Line kinds:** command in bone after a red `$ `; output in ash; agent handles in blue; warnings in red; blank gaps.
- **Playback:** the active command types two characters every 16ms, output lines then resolve in from a 3px blur over 420ms, a bone block caret blinks (1.1s, stepped) and freezes while typing. The panel grows with the session up to 76vh, then scrolls to keep the active block in view. Reduced motion shows everything at once.

### Margin Note (signature)
A title and one ash sentence beside the terminal, max 36ch, 88vh tall on wide screens. Inactive notes rest at 35% opacity and rise to full over 500ms when they become active; on narrow screens they are always full opacity and carry their own terminal excerpt.

### Network Map (signature)
A canvas map of the ahu repository's real registry (`registry.ts`): the repo at the centre, running tasks on the inner ring, agents fanned across one quadrant per harness, and each harness's pinned model on its axis. Hairline bone edges at 14% opacity; agents are blue when mid-task and blue at 40% when idle; harnesses are hollow bone rings; tasks are dim. Harness, model and repo labels are always shown in mono 11–12px; agent and task labels appear only on the traced path. One bone comet per running task rides its route from repo to model on a staggered 5.2s cycle. Hover or tap traces a node's connections and fades the rest to 18%. Animation pauses offscreen and is off under reduced motion; an sr-only list carries the same registry.

### Cracked Terminal (drift moment)
At the drift step the terminal's glass cracks: `public/media/cracked-glass.webp` (white cracks on alpha) screens over the panel at 14%, spreading from its impact point in the top-left corner with a clip-path circle over 900ms, and heals as the step passes. Narrow screens show it statically on the drift excerpt. Used only for drift.

### Cave Close
The close sits in the underground cave: `public/media/underground.webm`/`.mp4` (1280px, 27s forward-then-reverse loop, ~1.2–1.6 MB) full-bleed behind the column at 55% opacity, masked to black at top and bottom. It loads nothing until visible (`preload="none"`, poster first), pauses offscreen, and reduced-motion visitors get only the poster. The dimmed moai backdrop shows through it, so the head stands in the cave.

### Glitch Wordmark (signature)
The `ahu` display mark with two pseudo-element copies (red-shifted and blue-shifted, 70% opacity) that tear through horizontal clip bands on a 4s intermittent cycle. Used once, on the hero mark.

## Do's and Don'ts

### Do:
- **Do** keep the ground pure black (#000000) and let the particle moai be the only source of light.
- **Do** put anything that looks like terminal output in the terminal panel, and make it real, captured ahu output.
- **Do** reserve red for the prompt and warnings and blue for agent handles and focus.
- **Do** give every animation a `prefers-reduced-motion` off switch, as the cue, caret, line-in, tear and smooth scroll already have.
- **Do** use the one expo-out curve (cubic-bezier(0.16, 1, 0.3, 1)) for state and scroll transitions.
- **Do** keep dim (#7b7980) as the floor for any text that must be read.

### Don't:
- **Don't** add cards, feature grids, or boxed marketing sections; the only bordered surfaces are the terminal and the install field.
- **Don't** use icons beyond the authored GitHub mark and arrow, and never emoji as icons.
- **Don't** set prose or headings in monospace, or invent terminal output.
- **Don't** glitch anything but the wordmark, and don't make the tear continuous. The crack belongs to the drift step alone.
- **Don't** add a second filled call to action; the bone pill is the only one.
- **Don't** block drags on the hero; the hero is the moai's rotate surface and its drag-to-glitch listens on the whole document.
