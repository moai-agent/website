/**
 * One ahu session, captured from the ahu repository with ahu v0.4.0
 * (2026-09-24, built from the v0.4.0 tag) and trimmed. Home directories are
 * shortened and long blocks are cut where a line reads `…`; nothing else is
 * edited. When refreshing, re-run the commands rather than editing output by
 * hand.
 */

export type LineKind = "cmd" | "out" | "key" | "warn" | "gap";

export interface Line {
  kind: LineKind;
  text: string;
}

export interface Step {
  id: string;
  heading: string;
  note: string;
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
    heading: "A name should mean something.",
    note: "Each agent is a file in your repo that pins its harness, model, and instructions. Review changes to it like code.",
    lines: [
      cmd("ahu agents"),
      key("@dev-agy 1.0.0"),
      out("  harness  antigravity"),
      out("  model    gemini-3.1-pro-high"),
      out("  source   .agents/ahu/agents/dev-agy.md [manifest]"),
      out("  …"),
      gap,
      key("@dev-glm 1.0.2"),
      out("  harness  opencode"),
      out("  model    ollama/glm-5.3:cloud"),
      out("  source   .agents/ahu/agents/dev-glm.md [manifest]"),
      out("  …"),
      gap,
      key("@dev-opus 1.0.1"),
      out("  harness  claude-code"),
      out("  model    claude-opus-5"),
      out("  source   .agents/ahu/agents/dev-opus.md [manifest]"),
      out("  …"),
    ],
  },
  {
    id: "drift",
    heading: "Change an agent, and ahu notices.",
    note: "Same name, different inputs? You see it before the launch. If a harness or model is missing, the launch fails. ahu never swaps in another.",
    lines: [
      cmd("ahu launch @dev-opus --prompt 'Fix the flaky worktree cleanup test.' --dry-run --allow-widened-approvals"),
      warn("Drift since the last dev-opus@1.0.1 launch (task 01a0bf6e…, 2026-09-20T15:28:19Z)"),
      warn("  - the repository agent configuration changed: b0afa093f1b1 -> 6e2a98d519ee"),
      gap,
      out("The version label has not changed, but the effective inputs have. Any of these"),
      out("can make the agent behave differently from earlier runs under the same name."),
    ],
  },
  {
    id: "worktree",
    heading: "Every task gets its own worktree.",
    note: "A fresh branch from HEAD, with your agent config carried in. Your working files stay put. Run it in cmux, or headless in the background.",
    lines: [
      out("About to submit"),
      out("==============="),
      out("  agent      dev-opus@1.0.1"),
      out("  harness    claude-code"),
      out("  model      claude-opus-5"),
      out("  because    named agent @dev-opus 1.0.1 pins this harness and model"),
      out("  …"),
      key("  branch     ahu/dev-opus/01a0d4ff-f347-731d-b8b6-c2c0791ade22"),
      key("  worktree   .worktrees/01a0d4ff-f347-731d-b8b6-c2c0791ade22"),
      out("  base       fcc6f120d3e2f617f160f63cf79d99cd6cd2a764"),
    ],
  },
  {
    id: "horizon",
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
    id: "when",
    heading: "Try it when one agent isn’t enough.",
    note: "You already use Claude Code, Codex, OpenCode, or Antigravity. You want several on one repo at once, and a record of which agent did what.",
    lines: [
      cmd("ahu tasks"),
      key("@independently-review-issue-44 (ahu:task:01a0c045-8e52…) [session running] …"),
      out("  agent     dev-agy@1.0.0"),
      out("  harness   antigravity / gemini-3.1-pro-high"),
      out("  worktree  .worktrees/01a0c045-8e52-74e2-ba5e-ee6ea6536b65"),
      gap,
      key("@work-on-issue-44 (ahu:task:01a0c045-6f34…) [session running] …"),
      out("  agent     dev-glm@1.0.2"),
      out("  harness   opencode / ollama/glm-5.3:cloud"),
      out("  worktree  .worktrees/01a0c045-6f34-76f7-baca-0f1b4c7f9e13"),
    ],
  },
];

export const INSTALL = "cargo install --git https://github.com/moai-agent/ahu --locked";
export const REPO_URL = "https://github.com/moai-agent/ahu";
