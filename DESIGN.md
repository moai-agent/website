---
name: moai-agent / ahu
description: Illustrative ahu terminal sessions in or13.io's phosphor neutrals, under a particle moai on a black ground.
colors:
  signal-red: "oklch(0.68 0.19 28)"
  handle-blue: "oklch(0.76 0.11 250)"
  ground: "#000000"
  panel: "oklch(0.12 0.004 228.8)"
  rule: "oklch(0.275 0.011 216.9)"
  bone: "oklch(0.96 0.003 205)"
  ash: "oklch(0.72 0.016 213.5)"
  dim: "oklch(0.58 0.017 213.2)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "clamp(4.5rem, 14vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
  headline:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "clamp(2rem, 4.4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "clamp(1.5rem, 2.4vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.02em"
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
  button:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  mono-label:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  wordmark-label:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
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
  none: "0"
  focus: "2px"
  dot: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  column-gap: "clamp(32px, 5vw, 80px)"
  inline-gap: "8px"
  stack-sm: "16px"
  stack-md: "40px"
  stack-lg: "56px"
  panel-inset: "16px 18px"
  dot-gap: "14px"
  content-max: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
    typography: "{typography.button}"
  button-ghost:
    backgroundColor: "rgb(0 0 0 / 0.55)"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
    typography: "{typography.mono-label}"
  command-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-inset}"
    typography: "{typography.mono}"
  command-copy-hover:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.bone}"
  terminal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ash}"
    rounded: "{rounded.none}"
    padding: "16px 18px 24px"
    typography: "{typography.mono}"
  terminal-bar:
    textColor: "{colors.dim}"
    padding: "10px 16px"
  margin-note:
    textColor: "{colors.ash}"
    width: "36ch"
    typography: "{typography.body}"
  section-dot:
    backgroundColor: "{colors.ash}"
    rounded: "{rounded.dot}"
    size: "8px"
  section-dot-active:
    backgroundColor: "{colors.bone}"
    rounded: "{rounded.dot}"
    size: "8px"
---

# Design System: moai-agent / ahu

Scope: this records the site's only page, `/` (`src/app/page.tsx`, `src/components/Landing/` with its tokens on `.landing` in `landing.css`, fonts in `src/app/layout.tsx`, glitch keyframes in `src/app/globals.css`, the particle head in `src/components/Globe/`). The site stays a single page.

## Overview

**Creative North Star: "The Session in the Dark"**

The page is a stone head made of light, then one ahu terminal session told in or13.io's type and palette: cool phosphor neutrals, square corners, and mono headings with a faint glow. Black is the ground, not a theme. Everything that speaks is either cool bone prose in Lexend or Atkinson Hyperlegible Mono, the same cut the terminal prints in.

The particle moai lives only in the hero. It fills the first viewport, is rotated by dragging anywhere on the hero, and stops rendering once the hero scrolls away. Below it, each section carries at most one artwork and none repeats: a graded or13.io video or the cracked glass behind some session steps (see One Asset Per Section), nothing behind the network map, and nothing behind the close.

Density is deliberately low. Each idea gets a whole viewport of scroll: a short mono heading, one Lexend sentence, and an illustrative command that shows it. Every step is its own linkable section with its own replayable terminal that types an illustrative session as it scrolls into view. There are no cards, no feature grids, and no decorative illustration. The only colour is signal: red for the prompt and warnings, blue for agent handles, focus and the active section dot.

The CRT tear on the `ahu` wordmark is the one place the page glitches. It stays intermittent (a 4s cycle that bursts through its first 20% and holds closed) so it reads as signal loss, not noise.

**Key Characteristics:**
- Pure black ground; the particle moai owns the hero and pauses offscreen.
- Mono headings, wordmark, top-bar link and buttons with a faint phosphor glow; Lexend prose.
- Two signal colours only, each with a fixed meaning.
- Square, hairline-bordered dark panels for anything that is terminal output; nothing else is boxed.
- One asset per section below the hero.
- Section dots on the right edge, the only in-page navigation besides the scroll cue.
- Motion is scroll-driven and slow-settling on one expo-out curve, and every animation has a reduced-motion off switch.

## Aesthetic Lineage (or13.io)

ahu borrows or13.io's aesthetic, which that site's `/brand/aesthetic` page names **"CRT distortion / analog decay / phosphor burn / tech grief"**, and applies it with more restraint. or13.io's product principles bind here too: *the medium is the proof* and *signal over spectacle*.

**Taken from or13.io:**
- **Phosphor neutrals.** The cool oklch band (hue ~200–229) of or13.io's dark theme, on a true-black ground.
- **Square corners.** or13.io sets `--radius: 0`.
- **Mono display with a glow.** or13.io's dark-mode headings, buttons and badges are mono with `text-shadow: 0 0 5px` at 30% foreground. ahu sets them in Atkinson Hyperlegible Mono for legibility.
- **The RGB tear.** It comes from or13.io's GlitchText and is used once, on the wordmark.
- **Footage as place.** or13.io's videography grade is saturate 0.4, brightness 0.5, contrast 1.2. ahu uses five clips from that library (After Hours, Dark Water, Subterranean, Container Port and Landfill) and four photographs (Terminus, Gutted, Keep Out and Last Exit). Each is used once.
- **Cracked glass.** or13.io's CrackedGlass overlay, screened in dark mode, as the drift step's artwork.
- **Slide dots.** or13.io's right-edge slide nav, as section dots.

**Left behind on purpose,** because each would be a second artwork in a section or cost legibility:
- StaticNoise
- scan lines and flicker (the CRT overlay)
- Oscilloscope
- test pattern and monoscope
- DecryptText
- acoustic branding and ambient audio
- the decay photography grid (single photographs are used as step artwork instead)
- the light theme

They remain available: if a later section needs its one artwork, pick from or13.io's library, never add one on top of another.

**Captions, when media needs one,** follow or13.io's register: a short mono title and one line of plain, slightly elegiac prose ("Light finds its way down."). Never hype.

## Legibility (rule)

Every effect earns its place against legibility (from or13.io's anti-reference "effects that bury the message").

- **How to measure.** With the text hidden, capture the area behind the text block and take the 99th-percentile luminance of the background. Body text must clear 4.5:1 against that value; large text (24px+ bold) must clear 3:1. A pass on an average pixel is not a pass.
- **Hero.** A blurred radial scrim behind the text (94% black at the centre, fading out by 80%) keeps the line at 7.9:1 on desktop and 5.3:1 on phones, even over the brightest particles.
- **Session.** Each step's artwork sits under the vignette plus a flat 50% black shade, and the terminal panel is opaque. Measured notes (ash body text, p99 background): drift 5.7:1, worktree 5.9:1, telemetry 5.4:1, names 6.8:1, horizon 7.3:1. Every step clears 4.5:1 on desktop and phone.
- **Network.** No background. Canvas labels still carry a 4px black halo.
- **Close.** No media, so there is nothing to measure against.
- Any new artwork has to be measured this way before it ships.

## Colors

A cool, faintly cyan-grey ramp from black to bone (hue around 205 to 229, chroma below 0.02), with two saturated signal hues that mean something every time they appear. Values are authored in OKLCH; the frontmatter carries them as written.

### Primary
- **Signal Red** (signal-red): the shell prompt `$`, warning lines in the transcript (drift, missing context), the red fringe of the wordmark tear, and text selection (at 45% alpha). It marks "this is the command" or "this needs your attention."

### Secondary
- **Handle Blue** (handle-blue): agent handles and keys in terminal output (`@researcher 1.0.0`), busy agents on the network map, the focus ring, and the halo of the active section dot. It marks identity or position: a named thing you can address, or where you are.

### Neutral
- **Ground** (ground): the page background, the hero, the footer, the browser theme colour. Pure black, so the particles read as light.
- **Panel** (panel): terminal and install-command surfaces. One step off black, just enough to hold a hairline.
- **Rule** (rule): every hairline (panel borders, the terminal title-bar divider, the top-bar link border, the footer top rule, the copy-button divider), the copy button's hover fill, and the page scrollbar thumb.
- **Bone** (bone): headings, the hero line, typed commands, the terminal caret, the filled call-to-action, the active section dot, and network-map edges and rings. A cool near-white.
- **Ash** (ash): margin-note prose, terminal output lines, secondary labels (wordmark label, scroll cue, dot labels), idle section dots. About 8.2:1 on panel.
- **Dim** (dim): the quietest legible text: terminal title bar, provenance and source lines, footer. About 4.8:1 on panel is its floor; nothing dimmer carries words.

### Atmosphere
- **Glow** (`--glow`, `0 0 5px` of near-white at 30%): a text-shadow on every mono heading, the top-bar link, and the copy button on hover. It brightens to `0 0 8px` at 50% on the top-bar link's hover.
- **Vignette** (`--vignette`, an elliptical gradient from transparent at 45% to 65% black at the edge): laid over the session's cave video.

### Named Rules
**The Two Signals Rule.** Red means prompt or warning; blue means an agent's name, keyboard focus, or the current section. Neither is ever used as decoration, fill, or a section tint.

**The Cool Neutrals Rule.** Every neutral sits on the same cool hue band at near-zero chroma. Do not introduce a warm off-white or a warm grey; pure white appears only in selected text.

## Typography

**Heading and Label Font:** Atkinson Hyperlegible Mono 700 and 400 (with ui-monospace)
**Body Font:** Lexend 400 (with system-ui)

**Character:** or13.io's split. Atkinson Hyperlegible Mono carries every heading, the wordmark, the top-bar name and link, the buttons, the dot labels and the terminal, so the page's voice and its proof share one typeface. Lexend keeps the prose airy. Mono headings carry the faint glow. Fonts load through `next/font` as the CSS variables `--font-mono` and `--font-sans`.

### Hierarchy
- **Display** (mono 700, clamp(4.5rem, 14vw, 6rem), line-height 1, tracking 0.12em with a matching text-indent so it centres optically): the `ahu` wordmark only, carrying the RGB tear and a black legibility halo rather than the glow.
- **Headline** (mono 700, clamp(2rem, 4.4vw, 3.5rem), 1.05, 0.02em, max 18ch, glow): the closing call ("It's early. Try it.").
- **Title** (mono 700, clamp(1.5rem, 2.4vw, 2.125rem), 1.15, 0.02em, balanced wrap, glow): one per step, and the network heading (max 16ch).
- **Lead** (Lexend 400, clamp(1.05rem, 2.2vw, 1.35rem), balanced wrap): the single line under the wordmark.
- **Body** (Lexend 400, 1.0625rem, 1.6, pretty wrap, max 36ch beside the terminal, 44ch when stacked, 34ch in the network copy): story sentences, in ash.
- **Body small** (Lexend 400, 0.9375rem, max 60ch): requirements line under the install command.
- **Label** (Lexend 400, 0.875rem): the scroll cue.
- **Button** (mono 700, 1rem, 0.04em): the call-to-action.
- **Mono label** (mono 400, 0.875rem, 0.04em): the top-bar GitHub link and the copy button; dot labels use it at 0.75rem.
- **Wordmark label** (mono 400, 0.875rem, 0.2em tracking, ash): the `moai-agent` name in the top bar.
- **Mono** (400, 0.8125rem, 1.6, tabular numerals): terminal output; 0.875rem in the install field, 0.75rem in the terminal title bar and inline mobile excerpts; 11 to 12px on the network canvas.
- **Caption** (Lexend 400, 0.8125rem, dim): footer, provenance and the network source line.

### Named Rules
**The Illustrative Example Rule.** Anything shaped like terminal output is a synthetic, clearly labelled example that follows ahu's current command syntax and general output shape. Agent names, task handles, IDs, hashes, versions and paths are placeholders (`@builder`, `[task-id]`, `[base-commit]`, `[old-digest]`, `example/app`). Never copy real task IDs, terminal output, execution traces, or local or home-directory paths into website source. Every terminal is labelled "illustrative". Prose sentences stay in Lexend.

**The Unbroken Argument Rule.** Terminal lines wrap only between arguments; a path, URL or flag never splits mid-token. Wrapped lines hang-indent 4ch under the prompt.

## Layout

A single scrolling column framed by a fluid gutter with content capped at 1320px.

- **Hero:** exactly one small viewport tall (100svh), black, centred wordmark and line over a blurred radial black scrim, top bar absolutely positioned over it, scroll cue pinned to the bottom (respecting the safe-area inset). The whole hero is the moai's drag surface (grab cursor, vertical pan left to the browser); the top bar passes pointer events through except on its link.
- **Steps:** each step is its own two-column grid, copy 2fr and terminal 3fr, at least one viewport tall, with its artwork full-bleed behind it.
- **Network:** a two-column grid, copy 2fr and map 3fr, vertically centred, clamp(96px, 16vh, 180px) above; the source caption sits under the map.
- **Close:** generous air above (clamp(120px, 22vh, 220px)) and below (clamp(96px, 16vh, 160px)); headline, then 40px, install field (max 760px), 16px, requirements, 56px, call-to-action.
- **Section dots:** fixed at the vertical centre of the right edge (clamp(12px, 2vw, 32px) in), one per section (ahu, Session, Network, Install), 14px apart. The active dot follows whichever section crosses the viewport's middle.
- **Footer:** one row, name left and GitHub right, hairline top rule.
- **Below 900px:** grids collapse to one column. Step copy stacks above its terminal with 96px vertical padding, and the install field stacks with the copy button below it.
- **Below 640px:** the section dots are hidden.

**The One Idea Per Viewport Rule.** On wide screens each step of the story gets a full viewport of scroll and a single heading plus one sentence. Add a step, not a paragraph.

## Elevation & Depth

Flat surfaces over dark media. Depth comes from the asset behind each section and from opacity, not from stacked shadows: past terminal blocks fade to 45%, inactive notes to 35%, untraced map nodes to 18%.

### Shadow Vocabulary
- **Terminal lift** (`box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.9)`): every step terminal, so it separates from the artwork behind it.
- **Hero legibility halo** (`text-shadow: 0 2px 32px rgb(0 0 0 / 0.9)` on the wordmark, `0 1px 18px rgb(0 0 0 / 0.95)` on the line) plus the blurred radial black scrim behind the hero text: keeps type readable over the brightest particles.
- **Phosphor glow** (the glow token): mono headings and the top-bar link; the call-to-action carries a wider bone box glow (18px at 18%, 28px at 35% on hover); the active dot a 6px blue halo.

### Named Rules
**The Phosphor Rule.** Light is either the moai's particles or a faint screen glow on type and the one filled button. Glows stay faint and cool; shadows are black and exist only to hold text or the terminal off what is behind it.

## Shapes

Square. Every panel, field, button and link has a 0 corner: the terminal, the install field and its copy button, the top-bar link and the call-to-action. Borders are 1px hairlines in rule. The two exceptions are functional: the section dots are circles (50%), and the focus ring is 2px handle blue, offset 3px, with a 2px corner.

**The Square Corner Rule.** If a new surface needs a corner radius to look finished, it is the wrong surface. Only dots are round.

## Components

### Buttons
Quiet and direct: square buttons that point at GitHub.
- **Primary (call to action):** filled bone with black mono 700 text, 16px 24px, GitHub mark before and arrow after, with the soft bone glow. One per page, in the close.
- **Hover / Focus:** the arrow gap opens from 12px to 18px over 300ms on the expo-out curve and the glow widens; focus is the shared blue ring.
- **Ghost (top bar):** 55% black over the moai with a rule hairline, 8px 14px, mono label with glow, GitHub mark plus "GitHub"; hover turns the border bone and brightens the glow over 200ms.
- **Copy (inside the install field):** transparent, hairline divider, label swaps to "Copied" or "Select and copy" for 2s with a polite live-region announcement; hover fills with rule and picks up the glow.

### Inputs / Fields
- **Install command field:** a square, panel-coloured, hairline-bordered mono row: red `$ `, the command (breaking only between arguments), and the copy button. Not an editable input; it is a copyable command.

### Navigation
- **Top bar:** absolutely positioned over the hero, 18px vertical padding at the gutter. Mono wordmark label left in ash; ghost GitHub link right.
- **Section dots:** 8px ash circles at 40% opacity (80% on hover). The active dot turns bone, scales to 1.3 and takes a blue halo, and carries `aria-current`. Each dot's mono label (0.75rem, ash) fades in to its left on hover or focus. Styled after or13.io's slide nav.
- **Scroll cue:** "Watch a session" with a down arrow that nudges 4px every 2.4s.

### Step Section (signature)
Each step is its own full-viewport section with a stable `id`. It has a mono title with glow and one ash Lexend sentence (max 36ch) on the left (2fr), and its own terminal on the right (3fr). At most one artwork sits full-bleed behind it, masked to black at the top and bottom so neighbouring sections meet cleanly. Below 900px the copy stacks above the terminal.

### Terminal (signature, after or13.io's XtermTerminal)
Every step has its own xterm.js emulator playing a synthetic example in a square panel with a hairline border and the terminal lift shadow.
- **Title bar:** 0.75rem dim, `example/app` left (hidden on phones), "illustrative · ahu v0.5.0 syntax" right.
- **Theme:** the landing tokens as truecolor escapes. Command in bone after a red `$ `, output in ash, agent handles in blue, warnings in red, on the panel colour. Atkinson Hyperlegible Mono, 13px (11px on phones), line height 1.4, blinking block cursor.
- **Playback:** built 400px before it reaches the viewport. When 35% visible it types the command two characters every 16ms, then prints each output line 45ms apart. The terminal is sized to its wrapped transcript, so it never needs to scroll and never traps the wheel.
- **Replay shell:** afterwards a prompt waits. The step's own command replays the recording, `help` says what this is, `clear` clears, and anything else answers "not in this recording. Install ahu to run it for real." Nothing is executed.
- **Fallbacks:** the same transcript renders as a static `<pre>` without JavaScript, and stays in the DOM as sr-only text for screen readers. Reduced motion prints everything at once.

### Network Map (signature)
A canvas map of an illustrative repository (`registry.ts`, synthetic agents and tasks): the repo at the centre, running tasks on the inner ring, agents fanned across one quadrant per harness, and each harness's pinned model on its axis. Hairline bone edges at 14% opacity (55% when traced); agents are blue when mid-task and blue at 40% when idle; harnesses are hollow bone rings on black; tasks are dim. Harness, model and repo labels are always shown in mono 11 to 12px; agent and task labels appear only on the traced path. One bone comet per running task rides its route from repo to model on a staggered 5.2s cycle. Hover or tap traces a node's connections and fades the rest to 18%. Animation pauses offscreen and is off under reduced motion; an sr-only list carries the same registry. It has no background: the visual stands on its own.

### One Asset Per Section (rule)
Every section carries at most one background image or major artwork, and no asset appears twice. Each session step is its own section with its own artwork layer; a video plays only while its section is on screen.

| Section (fragment) | Artwork |
|---|---|
| Hero `#top` | The particle moai; renders only while the hero is on screen |
| A name should mean something `#names` | *After Hours* (or13.io `empty-lot`) video |
| Name an agent to start `#start` | *Terminus* (or13.io `overgrown-tracks`) photo |
| Change an agent, and ahu notices `#drift` | Cracked glass, screened at 35% |
| Every task gets its own worktree `#worktree` | *Dark Water* (or13.io `polluted-canal`) video |
| It says what it can't see `#horizon` | *Subterranean* (or13.io `underground`) video |
| Skills are context `#skills` | *Gutted* (or13.io `gutted-tv`) photo |
| Your coordinator can ask ahu over MCP `#mcp` | *Container Port* (or13.io `container-port`) video |
| Telemetry is off until you opt in `#telemetry` | *Landfill* (or13.io `landfill`) video |
| One command checks all of it `#doctor` | *Keep Out* (or13.io `broken-windows`) photo |
| Try it when one agent isn't enough `#when` | *Last Exit* (or13.io `decay-corridor`) photo |
| Network map `#network` | none. The visual stands on its own |
| Install `#install` | none |

Videos are 1280px, 20–27s forward-then-reverse loops (WebM + MP4 + poster), and photos are 1600px WebP. Both are graded with or13.io's recipe (saturate 0.4, brightness 0.42, contrast 1.2) under the vignette and a flat 50% black shade. They load nothing until their section is on screen. Reduced-motion visitors get the poster. Never add scan lines, flicker, or a second texture to a section that already has its artwork.

### Fragments (rule)
Every section has a stable `id` and is directly linkable (`moai-agent.com/#telemetry`). As you scroll, the address bar follows the section in view (`history.replaceState`, so the back button is untouched; the hero clears the hash). Step headings show a dim `#` anchor on hover and focus (always faintly on touch). The section dots are generated from the same list.

### Glitch Wordmark (signature)
The `ahu` display mark with two pseudo-element copies (red-shifted and blue-shifted, 70% opacity) that tear through horizontal clip bands on a 4s intermittent cycle. Used once, on the hero mark; off under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep the ground pure black (#000000) and every neutral on the cool hue band.
- **Do** put anything that looks like terminal output in the terminal panel, as a labelled synthetic example with placeholder names, IDs and paths.
- **Do** reserve red for the prompt and warnings and blue for agent handles, focus and the active dot.
- **Do** keep corners square; only the section dots are round.
- **Do** give every animation a `prefers-reduced-motion` off switch, as the cue, caret, line-in, tear, map, video and smooth scroll already have.
- **Do** use the one expo-out curve (cubic-bezier(0.16, 1, 0.3, 1)) for state and scroll transitions.
- **Do** keep dim as the floor for any text that must be read.
- **Do** stop rendering anything expensive that is offscreen, as the moai, the map and the cave loop do.

### Don't:
- **Don't** add cards, feature grids, or boxed marketing sections; the only bordered surfaces are the terminal, the install field and the top-bar link.
- **Don't** use icons beyond the authored GitHub mark and arrow, and never emoji as icons.
- **Don't** set prose sentences in mono, or paste real task IDs, terminal output, execution traces, or local paths into the site.
- **Don't** give any section a second asset, or give the close one.
- **Don't** glitch anything but the wordmark, and don't make the tear continuous.
- **Don't** let a glow get bright enough to read as neon; it stays at the glow token's strength.
- **Don't** add a second filled call to action; the bone button is the only one.
- **Don't** block drags on the hero; it is the moai's rotate surface.
