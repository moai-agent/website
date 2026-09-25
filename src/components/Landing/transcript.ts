/**
 * One ahu session, captured from the ahu repository with ahu v0.5.0 and
 * trimmed. Machine-specific task identifiers and paths are shortened; long
 * blocks are cut where a line reads `…`.
 */

export type LineKind = "cmd" | "out" | "key" | "warn" | "gap";

export interface Line {
  kind: LineKind;
  text: string;
}

/** The one artwork behind a step, or none. Each asset is used once. */
/** video: a graded loop; photo: a graded still; overlay: screened cracks. */
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
    note: "Each agent is a file in your repo that pins its harness, model, and instructions. Review changes to it like code.",
    lines: [
      cmd("ahu agents"),
      out("AGENT                 HARNESS       MODEL                         STATUS"),
      key("@dev-opus 1.0.1      claude-code   claude-opus-5                 .agents/ahu/agents/dev-opus.md"),
      key("@dev-glm 1.0.2       opencode      ollama/glm-5.3:cloud          .agents/ahu/agents/dev-glm.md"),
      key("@dev-agy 1.0.0       antigravity   gemini-3.1-pro-high           .agents/ahu/agents/dev-agy.md"),
    ],
  },
  {
    id: "drift",
    label: "Drift",
    backdrop: { kind: "overlay", src: "/media/cracked-glass.webp" },
    heading: "Change an agent, and ahu notices.",
    note: "Same name, different inputs? You see it before the launch. If a harness or model is missing, the launch fails. ahu never swaps in another.",
    lines: [
      cmd("ahu @dev-opus 'Update the README.' --dry-run --allow-widened-approvals"),
      warn("!! CONFIGURATION DRIFT: the selected agent's effective inputs changed."),
      gap,
      out("The version label has not changed, but the effective inputs have. Any of these"),
      out("can make the agent behave differently from earlier runs under the same name."),
    ],
  },
  {
    id: "worktree",
    label: "Worktrees",
    backdrop: { kind: "video", name: "dark-water" },
    heading: "Every task gets its own worktree.",
    note: "A fresh branch from HEAD, with your agent config carried in. Your working files stay put. Run it in cmux, or headless in the background.",
    lines: [
      cmd("ahu @dev-opus 'Update the README.' --dry-run --allow-widened-approvals"),
      out("…"),
      out("About to submit"),
      out("==============="),
      out("  agent      dev-opus@1.0.1"),
      out("  harness    claude-code"),
      out("  model      claude-opus-5"),
      out("  because    named agent @dev-opus 1.0.1 pins this harness and model"),
      out("  …"),
      key("  branch     ahu/dev-opus/<task-id>"),
      key("  worktree   .worktrees/<task-id>"),
      out("  base       <current-commit>"),
    ],
  },
  {
    id: "horizon",
    label: "Inventory",
    backdrop: { kind: "video", name: "underground" },
    heading: "It says what it can’t see.",
    note: "ahu lists the instructions, hooks, and settings it can find. Then it lists what it can’t.",
    lines: [
      cmd("ahu inventory @dev-opus"),
      out("…"),
      out("What ahu cannot see"),
      out("  - claude-code does not report to ahu which of the available sources it actually loaded into the model's context"),
      out("  - retrieval, compaction summaries, and conversation transformations inside a running session are not observable from outside it"),
      out("  - the model is set at launch with --model, but an interactive session can change it with /model"),
      gap,
      warn("This inventory is not complete."),
    ],
  },
  {
    id: "skills",
    label: "Skills",
    backdrop: { kind: "photo", src: "/media/gutted-tv.webp" },
    heading: "Skills are context. ahu keeps them in view.",
    note: "Every skill an agent can load is listed with where it lives and who controls it. ahu proposes cleanup on a project cadence and never deletes anything itself.",
    lines: [
      cmd("ahu hygiene @dev-opus"),
      out("Context hygiene review for dev-opus@1.0.1 (requested)"),
      out("Project cadence: every 7 day(s), set by context_hygiene.review_interval_days in ~/github.com/moai-agent/ahu/.agents/ahu/config.toml."),
      gap,
      out("Sources that may influence this agent:"),
      out("  - .agents/skills/context-hygiene/SKILL.md [skill, repository, shared]"),
      out("      at .agents/skills/context-hygiene/SKILL.md"),
      out("      control: repository-edit"),
      out("  …"),
      out("  - skills [skill, user, shared]"),
      out("      at ~/.claude/skills"),
      out("      control: harness-setting"),
      out("  …"),
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
      out("# tools_list holds a 2026-07-28 MCP tools/list request"),
      cmd(`echo "$tools_list" | ahu mcp serve | jq -r '.result.tools[] | "\\(.name)  \\(.description)"'`),
      key("ahu_agents_list  List launchable ahu agents registered in this repository."),
      key("ahu_tasks_list  List ahu tasks belonging to this repository, including canonical IDs and verified @name handles."),
      key("ahu_task_get  Inspect one ahu task by canonical ID, unique prefix, or exact @name handle."),
    ],
  },
  {
    id: "telemetry",
    label: "Telemetry",
    backdrop: { kind: "video", name: "landfill" },
    heading: "Telemetry is off until you opt in.",
    note: "Opt in per project and traces go to a local OTLP collector only. Token counts are what the harness reports. ahu never estimates them.",
    lines: [
      cmd("grep -A2 '^\\[telemetry\\]' docs/reference.md"),
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
    lines: [
      cmd("ahu tasks"),
      out("TASK HANDLE             TITLE                        STATE     AGENT                  MODE     LIVE    RUNTIME                      WORKTREE"),
      key("@task-name (ahu:…)     Example task                exited    dev-opus@1.0.1          cmux     unknown claude-code / claude-opus-5   .worktrees/<task-id>"),
      out("Run `ahu task <handle>` for task details."),
    ],
  },
];

export const INSTALL = "cargo install --git https://github.com/moai-agent/ahu --locked";
export const REPO_URL = "https://github.com/moai-agent/ahu";
