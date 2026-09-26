/**
 * Illustrative ahu sessions. Every transcript here is synthetic: it follows
 * the command syntax and general shape of ahu v0.5.0, but agent names, task
 * handles, IDs, hashes, versions and paths are placeholders, not captured
 * output. Never paste real task IDs, terminal output, execution traces, or
 * local paths into this file.
 */

/** The ahu release whose command syntax these examples follow. */
export const AHU_VERSION = "v0.5.0";

/** Bracketed placeholders: never shaped like a real ID, digest, or hash. */
const TASK = "[task-id]";
const BASE = "[base-commit]";

export type LineKind = "cmd" | "out" | "key" | "warn" | "gap";

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

export interface Step {
  /** Also the step's URL fragment, e.g. moai-agent.com/#drift. */
  id: string;
  /** Short name for the section dots. */
  label: string;
  heading: string;
  note: string;
  backdrop: Backdrop;
  lines: Line[];
  /** Tables: keep rows unwrapped and let the terminal scroll sideways. */
  wide?: boolean;
}

const cmd = (text: string): Line => ({ kind: "cmd", text });
const out = (text: string): Line => ({ kind: "out", text });
const key = (text: string): Line => ({ kind: "key", text });
const warn = (text: string): Line => ({ kind: "warn", text });
const gap: Line = { kind: "gap", text: "" };

export const STEPS: Step[] = [
  {
    id: "names",
    label: "Names",
    backdrop: { kind: "video", name: "after-hours" },
    heading: "A name should mean something.",
    note: "Each agent is a file in your repo that pins its harness, model, and instructions. ahu agents flags any whose inputs have drifted.",
    wide: true,
    lines: [
      cmd("ahu agents"),
      out("AGENT                    HARNESS       MODEL                  STATUS"),
      key("@architect 1.0.0         claude-code   claude-opus-5          .agents/ahu/agents/architect.md"),
      warn("@builder 1.2.0 [drifted] codex         gpt-6-astra            .agents/ahu/agents/builder.md"),
      key("@researcher 1.0.0        antigravity   gemini-3.1-pro-high    .agents/ahu/agents/researcher.md"),
      key("@reviewer 1.1.0          opencode      ollama/glm-5.3:cloud   .agents/ahu/agents/reviewer.md"),
    ],
  },
  {
    id: "start",
    label: "Start",
    backdrop: { kind: "photo", src: "/media/overgrown-tracks.webp" },
    heading: "Name an agent to start.",
    note: "ahu @agent opens the launcher with that agent already picked. Add a prompt to go straight to the preview. Pasting never submits.",
    lines: [
      cmd("ahu @reviewer"),
      key("Preselected agent: @reviewer"),
      gap,
      out("Resolved for this task:"),
      out("  agent   reviewer@1.1.0"),
      out("  harness opencode"),
      out("  model   ollama/glm-5.3:cloud"),
      out("  because named agent @reviewer 1.1.0 pins this harness and model"),
      gap,
      out("Task prompt. Paste or type as many lines as you like."),
      out("Pasting does not submit. A separate confirmation follows the preview."),
      out("  Finish: type `.` alone on a line, or end input."),
      out("  Cancel: type `.cancel` alone on a line to abandon it."),
      gap,
      out(".cancel"),
      out("Cancelled. Nothing was created."),
    ],
  },
  {
    id: "drift",
    label: "Drift",
    backdrop: { kind: "overlay", src: "/media/cracked-glass.webp" },
    heading: "Change an agent, and ahu notices.",
    note: "Same name, different inputs? You see it before the launch. If a harness or model is missing, the launch fails. ahu never swaps in another.",
    lines: [
      cmd("ahu @builder 'Fix the flaky cleanup test.' --dry-run"),
      warn("!! CONFIGURATION DRIFT: the selected agent's effective inputs changed."),
      warn(`Drift since the last builder@1.2.0 launch (task ${TASK}, [launched-at])`),
      warn("  - the repository agent configuration changed: [old-digest] -> [new-digest]"),
      gap,
      out("The version label has not changed, but the effective inputs have. Any of these"),
      out("can make the agent behave differently from earlier runs under the same name."),
      out("Treat this as a pending behavior bundle: bump the agent's version and record what"),
      out("changed. ahu does not do that for you, and it does not claim this change is a"),
      out("harmless patch."),
    ],
  },
  {
    id: "worktree",
    label: "Worktrees",
    backdrop: { kind: "video", name: "dark-water" },
    heading: "Every task gets its own worktree.",
    note: "A fresh branch from HEAD, with your agent config carried in. Your working files stay put. Run it in cmux or headless. The older ahu launch @agent form still works.",
    lines: [
      cmd("ahu @builder 'Fix the flaky cleanup test.' --dry-run"),
      out("About to submit"),
      out("  agent      builder@1.2.0"),
      out("  harness    codex"),
      out("  model      gpt-6-astra"),
      out("  because    named agent @builder 1.2.0 pins this harness and model"),
      key(`  branch     ahu/builder/${TASK}`),
      key(`  worktree   .worktrees/${TASK}`),
      out(`  base       ${BASE}`),
    ],
  },
  {
    id: "horizon",
    label: "Inventory",
    backdrop: { kind: "video", name: "underground" },
    heading: "It says what it can’t see.",
    note: "ahu lists the instructions, hooks, and settings it can find. Then it lists what it can’t.",
    lines: [
      cmd("ahu inventory @architect"),
      out("…"),
      out("What ahu cannot see"),
      out("  - claude-code does not report to ahu which of the available sources it actually loaded into the model's context"),
      out("  - retrieval, compaction summaries, and conversation transformations inside a running session are not observable from outside it"),
      out("  - ahu cannot disable in-session model switching or provider-side routing"),
      gap,
      warn("This inventory is not complete. `available` means a source is discoverable by the"),
      warn("harness, not that its contents reached the model."),
    ],
  },
  {
    id: "skills",
    label: "Skills",
    backdrop: { kind: "photo", src: "/media/gutted-tv.webp" },
    heading: "Skills are context. ahu keeps them in view.",
    note: "Every skill an agent can load is listed with where it lives and who controls it. ahu proposes cleanup on a project cadence and never deletes anything itself.",
    lines: [
      cmd("ahu hygiene @architect"),
      out("Context hygiene review for architect@1.0.0 (requested)"),
      out("Project cadence: every 7 day(s), set by context_hygiene.review_interval_days in .agents/ahu/config.toml."),
      gap,
      out("Sources that may influence this agent:"),
      out("  - .agents/skills/code-review/SKILL.md [skill, repository, shared]"),
      out("      at .agents/skills/code-review/SKILL.md"),
      out("      control: repository-edit"),
      out("  - plugins [skill, user, shared]"),
      out("      control: harness-setting"),
      gap,
      warn("Nothing has been changed. ahu does not purge memory, prune skills, disable"),
      warn("imported capabilities, or stage or commit anything on your behalf."),
    ],
  },
  {
    id: "mcp",
    label: "MCP",
    backdrop: { kind: "video", name: "container-port" },
    heading: "Your coordinator can ask ahu over MCP.",
    note: "ahu mcp serve answers read-only questions about this repo's agents and tasks over stdio. It inspects. It never launches, merges, or approves work.",
    lines: [
      out("# tools-list.jsonl: initialize, notifications/initialized, then tools/list (id 1)"),
      cmd(`ahu mcp serve < tools-list.jsonl | jq -r 'select(.id == 1) | .result.tools[].name'`),
      key("ahu_agents_list"),
      key("ahu_tasks_list"),
      key("ahu_task_get"),
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
    id: "doctor",
    label: "Doctor",
    backdrop: { kind: "photo", src: "/media/broken-windows.webp" },
    heading: "One command checks all of it.",
    note: "ahu doctor checks harnesses, hooks, telemetry, hygiene cadence, bundled skills, drift, and cmux, and says which warnings stop a launch.",
    lines: [
      cmd("ahu doctor"),
      out("harness      claude-code — executable ready"),
      out("harness      codex — executable ready"),
      out("harness      opencode — executable ready"),
      out("telemetry    off (local telemetry is opt-in)"),
      out("hygiene      architect@1.0.0: current"),
      warn("hygiene      reviewer@1.1.0: due (interval elapsed)"),
      out("skills       5/5 bundled skills verified; 0 missing, 0 changed"),
      warn("drift        @builder"),
      out("cmux         reachable"),
      gap,
      out("No blocking problems found. 2 warning(s) above affect behaviour but do not stop a launch."),
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
