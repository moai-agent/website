/**
 * Illustrative ahu sessions. Every transcript here is synthetic: it follows
 * the command syntax and general shape of ahu v0.5.0, but agent names, task
 * handles, IDs, hashes, versions and paths are placeholders, not captured
 * output. Never paste real task IDs, terminal output, execution traces, or
 * local paths into this file.
 */

import { CONTEXT_COLS, CONTEXT_FRAMES, HARNESS_FRAMES, LOCK_FRAMES, WORKTREE_COLS, WORKTREE_FRAMES } from "./harnessFrames";

/** The ahu release whose command syntax these examples follow. */
export const AHU_VERSION = "v0.5.0";

/** Bracketed placeholders: never shaped like a real ID, digest, or hash. */
const TASK = "[task-id]";
const BASE = "[base-commit]";

/** The headless hand-off every harness variant shows, in ahu v0.5.0's shape. */
const LAUNCH = "ahu @researcher --headless --background --prompt-file research.txt";
const HEADLESS = `Headless @researcher on antigravity / gemini-3.1-pro-high; output .ahu/state/tasks/${TASK}`;
const HANDOFF = `Task @flaky-survey (ahu:task:${TASK})`;
const REPLY = "@researcher is running headless on Antigravity (gemini-3.1-pro-high) as @flaky-survey.";

export type LineKind = "cmd" | "out" | "key" | "warn" | "dim" | "gap";

export interface Line {
  kind: LineKind;
  text: string;
}

/**
 * The one artwork behind a step, or none; each asset is used once.
 * video: a graded loop; photo: a graded still; overlay: screened cracks.
 */
export type Backdrop =
  | { kind: "video"; name: string }
  | { kind: "photo"; src: string }
  | { kind: "overlay"; src: string }
  | null;

/**
 * The same moment as rendered by one coordinating harness. The frame (glyphs,
 * gutters, collapse markers) follows that harness's own TUI; the text inside it
 * is synthetic ahu output.
 */
export interface Variant {
  id: string;
  /** Tab label: the harness's product name. */
  label: string;
  /** What precedes the user's message, e.g. Claude Code's `❯ `. */
  prompt: string;
  lines: Line[];
  /** Captured screens with the harness's own colours; played instead of `lines`. */
  frames?: string[][];
  /** The harness's own screen colour, when it paints one (OpenCode does). */
  screen?: string;
  /** Columns the frames were captured at, when not the default 88. */
  cols?: number;
}

export interface Step {
  /** Also the step's URL fragment, e.g. moai-agent.com/#lock. */
  id: string;
  /** Short name for the section dots. */
  label: string;
  heading: string;
  note: string;
  backdrop: Backdrop;
  lines: Line[];
  /** Tables: keep rows unwrapped and let the terminal scroll sideways. */
  wide?: boolean;
  /** One rendering per harness; the viewer picks the one they recognize. */
  variants?: Variant[];
  /** Captured screens shown in the cmux window instead of typing `lines`. */
  frames?: string[][];
  /** The cmux tab title for `frames`. */
  tab?: string;
  /** Columns `frames` were captured at, when not the default 88. */
  cols?: number;
}

const cmd = (text: string): Line => ({ kind: "cmd", text });
const out = (text: string): Line => ({ kind: "out", text });
const key = (text: string): Line => ({ kind: "key", text });
const warn = (text: string): Line => ({ kind: "warn", text });
const dim = (text: string): Line => ({ kind: "dim", text });
const gap: Line = { kind: "gap", text: "" };

export const STEPS: Step[] = [
  {
    id: "identity",
    label: "Identity",
    backdrop: { kind: "video", name: "after-hours" },
    heading: "Named agents you can trust.",
    note: "A different model is a different data processor. A different harness has different permissions. ahu won’t let either hide behind a familiar name.",
    wide: true,
    lines: [
      cmd("ahu agents"),
      out("AGENT                    HARNESS       MODEL           STATUS"),
      key("@architect 1.0.0         claude-code   claude-opus-5   .agents/ahu/agents/architect.md"),
      warn("@builder 1.2.0 [drifted] codex         gpt-6-astra     .agents/ahu/agents/builder.md"),
    ],
  },
  {
    id: "invocation",
    label: "Invocation",
    backdrop: { kind: "photo", src: "/media/overgrown-tracks.webp" },
    heading: "One harness can call another.",
    note: "Codex asks for @researcher. ahu starts it on Antigravity, headless, with the model it pinned. No harness picks for you.",
    lines: [],
    variants: [
      {
        id: "claude-code",
        label: "Claude Code",
        prompt: "❯ ",
        frames: HARNESS_FRAMES["claude-code"],
        lines: [
          cmd("Hand the flaky-test survey to @researcher."),
          gap,
          key(`⏺ Bash(${LAUNCH})`),
          out(`  ⎿  ${HEADLESS}`),
          out(`     ${HANDOFF}`),
          dim("     … +14 lines (ctrl+o to expand)"),
          gap,
          out(`⏺ ${REPLY}`),
        ],
      },
      {
        id: "codex",
        label: "Codex",
        frames: HARNESS_FRAMES.codex,
        prompt: "› ",
        lines: [
          cmd("Hand the flaky-test survey to @researcher."),
          gap,
          key(`• Ran ${LAUNCH}`),
          out(`  └ ${HEADLESS}`),
          out(`    ${HANDOFF}`),
          dim("    … +14 lines"),
          gap,
          dim("─ Worked for 6s ─────────────────────────"),
          gap,
          out(`• ${REPLY}`),
        ],
      },
      {
        // Antigravity hands off to an OpenCode agent, so this tab also crosses harnesses.
        id: "antigravity",
        label: "Antigravity",
        prompt: "> ",
        frames: HARNESS_FRAMES.antigravity,
        lines: [
          cmd("Hand the cleanup review to @reviewer."),
          dim("▸ Thought for 4s, 420 tokens"),
          key("● Bash(ahu launch @reviewer --headless --background --output json --prompt-file review.txt)"),
          dim("  ⎿  <output +9 lines>"),
          out('            "identity": {'),
          out('              "agent": "@reviewer",'),
          out('              "harness": "opencode",'),
          out('              "model": "ollama/glm-5.3:cloud"'),
          out("            },"),
          out('            "acceptance": "not assessed"'),
          out("          } (ctrl+o to collapse)"),
          out("  @reviewer is running headless on OpenCode as @review-fix."),
        ],
      },
      {
        id: "opencode",
        label: "OpenCode",
        frames: HARNESS_FRAMES.opencode,
        screen: "#0a0a0a",
        prompt: "┃  ",
        lines: [
          cmd("Hand the flaky-test survey to @researcher."),
          gap,
          key(`┃  $ ${LAUNCH}`),
          out(`┃  ${HEADLESS}`),
          out(`┃  ${HANDOFF}`),
          dim("┃  …"),
          gap,
          out(`   ${REPLY}`),
          dim("   ▣  Build · Big Pickle · 8.6s"),
        ],
      },
    ],
  },
  {
    id: "lock",
    label: "Lock",
    backdrop: { kind: "overlay", src: "/media/cracked-glass.webp" },
    heading: "A lockfile for your agents.",
    note: "Each agent's harness, model, and instructions are pinned in your repo. ahu doctor names any agent that no longer matches its lock.",
    // ahu doctor in the cmux terminal, as captured (see harnessFrames.ts).
    tab: "~/example/app",
    frames: LOCK_FRAMES,
    lines: [
      cmd("git diff .agents/ahu/agents/builder.md"),
      warn("-model: gpt-6-astra"),
      key("+model: gpt-5.5"),
      out(" version: 1.2.0"),
      gap,
      cmd("ahu doctor"),
      out("drift        1 registered agent drifted"),
      out("  @builder 1.2.0  since task @fix-flaky-test (2026-09-24)"),
      out("    - model: gpt-6-astra -> gpt-5.5 (version still 1.2.0)"),
      out("  Bump the version in the agent's manifest and record what changed, or restore it."),
    ],
  },
  {
    id: "worktree",
    label: "Worktrees",
    backdrop: { kind: "video", name: "dark-water" },
    heading: "Every task is a branch you can review.",
    note: "A fresh worktree per task, so each agent's work lands as a branch you diff, merge, or throw away.",
    // ahu tasks in the cmux terminal, as captured (see harnessFrames.ts).
    tab: "~/example/app",
    frames: WORKTREE_FRAMES,
    cols: WORKTREE_COLS,
    lines: [
      cmd("ahu tasks"),
      out("HANDLE           STATE    AGENT             RUNTIME                            BRANCH"),
      key("@review-fix      running  reviewer@1.1.0    opencode / ollama/glm-5.3:cloud    ahu/reviewer/[task-3]"),
      key("@flaky-survey    running  researcher@1.0.0  antigravity / gemini-3.1-pro-high  ahu/researcher/[task-2]"),
      key("@fix-flaky-test  running  builder@1.2.0     codex / gpt-6-astra                ahu/builder/[task-1]"),
    ],
  },
  {
    id: "context",
    label: "Context",
    backdrop: { kind: "photo", src: "/media/gutted-tv.webp" },
    heading: "Context you can audit.",
    note: "Each agent's instructions are a file in your repo. ahu writes its skills there too, for you to review and commit.",
    // ahu agents and ahu mcp setup in the cmux terminal (see harnessFrames.ts).
    tab: "~/example/app",
    frames: CONTEXT_FRAMES,
    cols: CONTEXT_COLS,
    lines: [
      cmd("ahu agents"),
      out("AGENT              HARNESS      MODEL                 STATUS"),
      key("@builder 1.2.0     codex        gpt-6-astra           .agents/ahu/agents/builder.md"),
      key("@researcher 1.0.0  antigravity  gemini-3.1-pro-high   .agents/ahu/agents/researcher.md"),
      key("@reviewer 1.1.0    opencode     ollama/glm-5.3:cloud  .agents/ahu/agents/reviewer.md"),
      gap,
      cmd("ahu mcp setup"),
      out("Wrote ~/example/app/.agents/skills/discover-requirements/SKILL.md"),
      out("Wrote ~/example/app/.agents/skills/direct-agents/SKILL.md"),
      out("Wrote ~/example/app/.agents/skills/context-hygiene/SKILL.md"),
    ],
  },
  {
    id: "telemetry",
    label: "Telemetry",
    backdrop: { kind: "video", name: "landfill" },
    heading: "Telemetry is off until you opt in.",
    note: "Opt in per project and traces go to a local OTLP collector only. Token counts are what the harness reports. ahu never estimates them.",
    lines: [
      cmd("cat .agents/ahu/config.toml"),
      out("…"),
      out("[telemetry]"),
      out("enabled = true"),
      out('endpoint = "http://127.0.0.1:4318"'),
    ],
  },
  {
    id: "when",
    label: "When",
    backdrop: { kind: "photo", src: "/media/decay-corridor.webp" },
    heading: "Try it when one agent isn’t enough.",
    note: "You already use Claude Code, Codex, OpenCode, or Antigravity. You want several on one repo at once, and a record of which agent did what.",
    wide: true,
    lines: [
      cmd("ahu tasks"),
      out("TASK HANDLE             TITLE                        STATE     AGENT                  MODE     LIVE    RUNTIME                         WORKTREE"),
      key("@fix-flaky-test         Fix the flaky cleanup test   running   builder@1.2.0          cmux     live    codex / gpt-6-astra             .worktrees/[task-id-1]"),
      key("@review-fix             Review the cleanup fix       running   reviewer@1.1.0         cmux     live    opencode / ollama/glm-5.3:cloud .worktrees/[task-id-2]"),
      out("@update-docs            Update the docs              exited    architect@1.0.0        headless stale   claude-code / claude-opus-5     .worktrees/[task-id-3]"),
    ],
  },
];

export const REPO_URL = "https://github.com/moai-agent/ahu";
