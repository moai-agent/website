/**
 * The ahu repository's own agents and running tasks, from `ahu agents` and
 * `ahu tasks` run with ahu v0.4.0 on 2026-09-24. Only handles, versions,
 * harnesses, and models are kept; task titles stay out. Refresh by re-running
 * both commands.
 */

export interface Harness {
  id: string;
  model: string;
}

export interface Agent {
  handle: string;
  version: string;
  harness: string;
}

export interface Task {
  handle: string;
  agent: string;
}

export const REPO = "moai-agent/ahu";

export const HARNESSES: Harness[] = [
  { id: "claude-code", model: "claude-opus-5" },
  { id: "codex", model: "gpt-6-astra" },
  { id: "antigravity", model: "gemini-3.1-pro-high" },
  { id: "opencode", model: "ollama/glm-5.3:cloud" },
];

export const AGENTS: Agent[] = [
  { handle: "@arch-opus", version: "1.0.0", harness: "claude-code" },
  { handle: "@defsec-opus", version: "1.0.0", harness: "claude-code" },
  { handle: "@dev-opus", version: "1.0.1", harness: "claude-code" },
  { handle: "@docs-opus", version: "1.0.0", harness: "claude-code" },
  { handle: "@arch-astra", version: "1.0.0", harness: "codex" },
  { handle: "@defsec-astra", version: "1.0.1", harness: "codex" },
  { handle: "@dev-astra", version: "1.0.1", harness: "codex" },
  { handle: "@docs-astra", version: "1.1.1", harness: "codex" },
  { handle: "@offsec-astra", version: "1.0.1", harness: "codex" },
  { handle: "@roadmap-architect", version: "1.0.0", harness: "codex" },
  { handle: "@roadmap-product-manager", version: "1.0.0", harness: "codex" },
  { handle: "@dev-agy", version: "1.0.0", harness: "antigravity" },
  { handle: "@arch-glm", version: "1.0.0", harness: "opencode" },
  { handle: "@defsec-glm", version: "1.0.1", harness: "opencode" },
  { handle: "@dev-glm", version: "1.0.2", harness: "opencode" },
  { handle: "@docs-glm", version: "1.1.1", harness: "opencode" },
];

export const TASKS: Task[] = [
  { handle: "@review-the-current-ahu-2", agent: "@docs-astra" },
  { handle: "@independently-review-the-current", agent: "@dev-agy" },
  { handle: "@complete-roadmap-issue-40", agent: "@docs-glm" },
  { handle: "@independently-review-issue-44", agent: "@dev-agy" },
  { handle: "@work-on-issue-44", agent: "@dev-glm" },
];

export type NodeKind = "repo" | "task" | "agent" | "harness" | "model";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  /** Unit-circle position; the canvas scales it. */
  x: number;
  y: number;
  angle: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: [string, string][];
  /** Each running task's route from the repo out to its model. */
  routes: string[][];
}

const RADIUS: Record<NodeKind, number> = {
  repo: 0,
  task: 0.3,
  agent: 0.58,
  harness: 0.78,
  model: 0.95,
};

/*
 * One quadrant per harness. Agents fan across their harness's quadrant, the
 * harness and its pinned model sit on the quadrant's axis, and each task
 * sits just inside the agent that runs it.
 */
export function buildGraph(): Graph {
  const nodes: GraphNode[] = [];
  const edges: [string, string][] = [];
  const at = (id: string, kind: NodeKind, label: string, angle: number) => {
    const r = RADIUS[kind];
    nodes.push({ id, kind, label, angle, x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  };
  const agentAngle = new Map<string, number>();

  at(REPO, "repo", REPO, 0);
  const sector = (Math.PI * 2) / HARNESSES.length;
  HARNESSES.forEach((h, i) => {
    const axis = -Math.PI / 2 + sector * (i + 0.5);
    at(h.id, "harness", h.id, axis);
    at(h.model, "model", h.model, axis);
    edges.push([h.id, h.model]);

    const members = AGENTS.filter((a) => a.harness === h.id);
    const spread = sector * 0.72;
    members.forEach((a, j) => {
      const angle =
        members.length === 1 ? axis : axis - spread / 2 + (spread * j) / (members.length - 1);
      agentAngle.set(a.handle, angle);
      at(a.handle, "agent", `${a.handle} ${a.version}`, angle);
      edges.push([a.handle, h.id]);
    });
  });

  const perAgent = new Map<string, number>();
  const routes: string[][] = [];
  for (const t of TASKS) {
    const n = perAgent.get(t.agent) ?? 0;
    perAgent.set(t.agent, n + 1);
    // Two tasks on one agent split either side of it.
    const angle = (agentAngle.get(t.agent) ?? 0) + (n === 0 ? 0 : n % 2 ? 0.3 : -0.3);
    at(t.handle, "task", t.handle, angle);
    edges.push([REPO, t.handle], [t.handle, t.agent]);
    const harness = AGENTS.find((a) => a.handle === t.agent)!.harness;
    const model = HARNESSES.find((h) => h.id === harness)!.model;
    routes.push([REPO, t.handle, t.agent, harness, model]);
  }

  return { nodes, edges, routes };
}
