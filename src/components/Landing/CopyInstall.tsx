"use client";

import { Fragment, useState } from "react";

export default function CopyInstall({ command }: { command: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div className="install">
      <code>
        <span className="term-prompt">$ </span>
        {/* Break only between arguments so the URL and flags never split. */}
        {command.split(" ").map((arg, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span>{arg}</span>
          </Fragment>
        ))}
      </code>
      <button type="button" onClick={copy} className="install-copy">
        {state === "copied" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Install command copied" : state === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
}
