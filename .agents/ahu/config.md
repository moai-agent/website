---
ahu:
  catalog_version: 2026-10-19
  harness_preferences:
  - antigravity
  - claude-code
  - codex
  harness_version_pins: {}
  knowledge:
    bundles:
    - .agents/ahu/agents
    fail_on_warnings: false
  model_rankings:
    antigravity:
    - gemini-3.1-pro-high
    claude-code:
    - claude-opus-5
    codex:
    - gpt-6-astra
  model_selection: project-ranked
  schema_version: 1
  telemetry:
    enabled: false
    endpoint: http://127.0.0.1:4318
    local_metrics: false
okf_version: '0.2'
type: ahu:project
---

# Project policy

One policy for every ahu user in this project. Review and commit this file.
