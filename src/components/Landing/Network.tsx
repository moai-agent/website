"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AGENTS, HARNESSES, TASKS, buildGraph, type GraphNode } from "./registry";

const BONE = "236, 232, 225";
const BLUE = "oklch(0.76 0.11 250)";

const NODE_RADIUS: Record<GraphNode["kind"], number> = {
  repo: 5,
  task: 2.5,
  agent: 3,
  harness: 4.5,
  model: 3.5,
};

/** Everything one node is connected to, walked in both directions. */
function reach(start: string, edges: [string, string][]) {
  const seen = new Set([start]);
  const walk = (id: string, dir: 0 | 1) => {
    for (const e of edges) {
      if (e[dir] === id && !seen.has(e[1 - dir])) {
        seen.add(e[1 - dir]);
        walk(e[1 - dir], dir);
      }
    }
  };
  walk(start, 0);
  walk(start, 1);
  return seen;
}

export default function Network() {
  const graph = useMemo(buildGraph, []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);
  hoverRef.current = hover;

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(canvas).fontFamily;
    let size = 0;
    let dpr = 1;
    let frame = 0;
    let visible = false;
    let start = performance.now();

    const px = (n: GraphNode) => [size / 2 + n.x * size * 0.44, size / 2 + n.y * size * 0.44] as const;

    const draw = (now: number) => {
      const lit = hoverRef.current ? reach(hoverRef.current, graph.edges) : null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      for (const [a, b] of graph.edges) {
        const on = !lit || (lit.has(a) && lit.has(b));
        const [x1, y1] = px(byId.get(a)!);
        const [x2, y2] = px(byId.get(b)!);
        ctx.strokeStyle = `rgba(${BONE}, ${on ? (lit ? 0.55 : 0.14) : 0.04})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // One comet per running task, riding its route from the repo out to the model.
      if (!reduced) {
        const t = (now - start) / 1000;
        graph.routes.forEach((route, i) => {
          if (lit && !route.every((id) => lit.has(id))) return;
          const pts = route.map((id) => px(byId.get(id)!));
          const lens = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1]));
          const total = lens.reduce((s, l) => s + l, 0);
          const pos = (d: number) => {
            for (let k = 0; k < lens.length; k++) {
              if (d <= lens[k]) {
                const f = d / lens[k];
                return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f];
              }
              d -= lens[k];
            }
            return pts[pts.length - 1];
          };
          // 3.2s out, then a pause, staggered so the tasks never pulse in unison.
          const cycle = ((t + i * 1.37) % 5.2) / 3.2;
          if (cycle > 1) return;
          const head = cycle * total;
          for (let s = 0; s < 18; s++) {
            const d = head - s * 4;
            if (d < 0) break;
            const [x, y] = pos(d);
            ctx.fillStyle = `rgba(${BONE}, ${0.9 * (1 - s / 18) ** 2})`;
            ctx.beginPath();
            ctx.arc(x, y, s === 0 ? 1.8 : 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      const busy = new Set(TASKS.map((t) => t.agent));
      for (const n of graph.nodes) {
        const on = !lit || lit.has(n.id);
        const [x, y] = px(n);
        const r = NODE_RADIUS[n.kind];
        ctx.globalAlpha = on ? 1 : 0.18;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (n.kind === "harness") {
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = `rgb(${BONE})`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        } else {
          ctx.fillStyle =
            n.kind === "agent"
              ? busy.has(n.id)
                ? BLUE
                : "oklch(0.76 0.11 250 / 0.4)"
              : n.kind === "task"
                ? "#7b7980"
                : `rgb(${BONE})`;
          ctx.fill();
        }

        const labelled =
          n.kind === "harness" || n.kind === "model" || n.kind === "repo" || (lit && lit.has(n.id));
        if (labelled && on) {
          const outward = n.kind === "repo" ? 0 : Math.cos(n.angle);
          ctx.font = `${n.kind === "harness" || n.kind === "repo" ? 12 : 11}px ${font}`;
          ctx.fillStyle = n.kind === "agent" ? BLUE : n.kind === "harness" || n.kind === "repo" ? `rgb(${BONE})` : "#a3a1a8";
          ctx.textBaseline = "middle";
          // Centre labels, repo and models, stack vertically so long model ids fit narrow screens.
          const stacked = n.kind === "repo" || n.kind === "model";
          ctx.textAlign = stacked ? "center" : outward >= 0 ? "left" : "right";
          const gap = r + 7;
          const lx = stacked ? x : x + (outward >= 0 ? gap : -gap);
          const ly = n.kind === "repo" ? y + 16 : n.kind === "model" ? y + (Math.sin(n.angle) >= 0 ? 14 : -14) : y;
          ctx.fillText(n.label, lx, ly);
        }
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = visible && !reduced ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      size = Math.min(wrap.clientWidth, 820);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      kick();
    };

    const hit = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let best: string | null = null;
      let bestD = 16;
      for (const n of graph.nodes) {
        const [x, y] = px(n);
        const d = Math.hypot(x - mx, y - my);
        if (d < bestD) {
          bestD = d;
          best = n.id;
        }
      }
      return best;
    };
    const onMove = (e: PointerEvent) => {
      const id = hit(e);
      if (id !== hoverRef.current) {
        setHover(id);
        hoverRef.current = id;
        kick();
      }
      canvas.style.cursor = id ? "pointer" : "default";
    };
    const onLeave = () => {
      setHover(null);
      hoverRef.current = null;
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start = performance.now() - 800;
        kick();
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [graph]);

  return (
    <section className="network" aria-labelledby="network-heading">
      <div className="network-copy">
        <h2 id="network-heading">
          {AGENTS.length} agents. {HARNESSES.length} harnesses. One repo.
        </h2>
        <p>The ahu repository runs on ahu. Blue agents are mid-task. Hover or tap to trace one.</p>
      </div>
      <div className="network-stage" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="network-canvas"
          role="img"
          aria-label={`${AGENTS.length} agents in the ahu repository across ${HARNESSES.length} harnesses, each harness pinned to one model, with ${TASKS.length} tasks running.`}
        />
      </div>
      <ul className="sr-only">
        {AGENTS.map((a) => (
          <li key={a.handle}>
            {a.handle} {a.version}: {a.harness}, {HARNESSES.find((h) => h.id === a.harness)!.model}
            {TASKS.some((t) => t.agent === a.handle) ? ", task running" : ""}
          </li>
        ))}
      </ul>
      <p className="network-source">Snapshot of ahu agents and ahu tasks, v0.4.0, 24 Sep 2026.</p>
    </section>
  );
}
