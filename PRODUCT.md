# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers who already run coding agents (Claude Code, Codex, OpenCode, Antigravity CLI) and want several of them working in parallel on one repository without losing track of who did what, with which model, under which instructions. They evaluate the site from a laptop, usually between terminal sessions, and judge it the way they judge a CLI: by precision, honesty about limits, and whether the commands look real.

## Product Purpose

moai-agent.com is the public home of `ahu`, a Rust CLI that launches repository-defined coding agents in fresh Git worktrees, interactively in cmux or unattended in headless mode. The site explains why ahu exists, how it works, and when it is worth trying. Success: a visiting developer understands the mechanism (repo-pinned agent identity + isolated worktree per task + honest context inventory), gets curious, and goes to the GitHub repo to try it and give feedback.

## Positioning

An ahu agent is a named, reviewable identity (name, harness, exact model, instructions) that lives in the repository and never silently changes. Launches use the configured harness and model or fail with an actionable error; ahu never substitutes. It defers to each harness's native conventions instead of imposing a lowest-common-denominator layout, and it says what it cannot see rather than claiming a complete context picture.

## Operating Context

- Git checkout, `.worktrees/` per task on `ahu/<agent>/<task-id>` branches.
- cmux terminal for interactive sessions; headless supervisor for unattended runs.
- Agent manifests in `.agents/ahu/agents/*.md`; project policy in `.agents/ahu/config.toml`, shared through Git (ahu never stages, commits, or pushes).
- GitHub issues and projects as the planning surface; agents use `gh`, ahu does not.

## Capabilities and Constraints

- Commands: `ahu`, `ahu @agent [prompt]`, `ahu doctor`, `ahu agents`, `ahu launch @agent` (backward-compatible), `ahu tasks`, `ahu task`, `ahu diff`, `ahu result`, `ahu focus`, `ahu cancel`, `ahu inventory`, `ahu hygiene`, `ahu explain`, `ahu mcp serve`.
- Prompt delivery in nonce-bearing sections (contract, state, instructions, task); prompt text, not an enforced system prompt.
- Headless child dispatch requires explicit host grants.
- ahu holds no provider credentials and installs no harnesses.
- Public at https://github.com/moai-agent/ahu, pre-1.0 (latest published: v0.4.0 pre-release; v0.5.0 prepared locally). Install: `cargo install --git https://github.com/moai-agent/ahu --locked`. Call it early; make no stability claims.
- The site's job is to send developers to the GitHub repo to try ahu and give feedback.
- One page for as long as possible. Static export (Next.js `output: "export"`) on GitHub Pages; no backend.

## Brand

Modelled on or13.io's `/brand` page: why it exists, what it does, how it does it. ahu comes from the same maker as or13.io and inherits that site's aesthetic (see DESIGN.md, Aesthetic Lineage).

### Why does ahu exist?

Coding agents are multiplying, and an agent's name stops meaning anything the moment its harness, model, or instructions change quietly.

### What does ahu do?

TLDR: ahu launches named coding agents, each pinned to its harness and model, in a fresh Git worktree per task.

- **Identity in the repo.** An agent is a reviewed file, not a setting on someone's laptop.
- **A worktree per task.** Parallel agents never share a working copy.
- **An honest inventory.** ahu shows what can reach an agent's context, and what it cannot see.

### How does ahu do it?

- **I. Same name, same agent.** Harness, model, and instructions are pinned; drift is shown before launch.
- **II. Fail loudly.** A missing harness or model stops the launch. ahu never substitutes.
- **III. Say what you can't see.** Coverage gaps are reported, never papered over.

### Personality

**Precise · Honest · Crafted.** Inherited from or13.io's "Bold · Experimental · Crafted", turned toward a tool: the craft still shows, but every claim matches what ahu does, and every example is labelled as one.

### Anti-references

- Generic AI-slop or template SaaS landing pages (or13.io's first anti-reference).
- Crypto/web3 hype: neon gradients, glossy 3D-for-3D's-sake. Effects must read as engineering.
- Over-designed portfolio: effects that bury the message. Every effect earns its place against legibility.
- Dev-tool clichés: feature grids, fake terminal output, benchmark bragging.

## Brand Commitments

- Name `moai-agent`; CLI `ahu` (lowercase). Moai emoji 🗿 is the favicon; the org portrait is the share image.
- Existing identity: black ground, GPU particle globe shaped into a moai head, CRT glitch post-process. The particle moai stays as the hero.
- Voice: extremely minimal text, just enough to sell the idea and raise curiosity. No SaaS marketing tone, no overclaiming, no emoji as icons.

## Evidence on Hand

- Public ahu README (install, everyday use, agent table, command table).
- ahu v0.5.0 command syntax: `ahu @agent [prompt]` (no prompt opens the launcher with the agent preselected), the backward-compatible `ahu launch @agent`, `ahu doctor`, `ahu agents` with drift status, and compact `ahu tasks`.
- Licensed or13.io media library (videos and photographs in `public/media/`).
- Examples on the site are synthetic: never publish real task IDs, terminal output, execution traces, or local paths.
- No users, testimonials, benchmarks, or adoption numbers. Do not invent them.
- The "why" paraphrases the maintainer's own design principles; keep private planning material off the site.

## Product Principles

1. Identity is stable: same name means same harness, model, and instructions.
2. Fail loudly instead of substituting.
3. The repository owns agent configuration; changes are reviewable Git diffs.
4. Defer to each harness's native conventions.
5. Say what you cannot see.
6. Signal over spectacle (from or13.io): a high-signal scan must resolve in seconds; legibility outranks flourish.
