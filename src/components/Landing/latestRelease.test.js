import { afterEach, expect, test } from "bun:test";
import { installCommand, latestAhuTag } from "./latestRelease";

const originalFetch = globalThis.fetch;
const originalCI = process.env.CI;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalCI === undefined) delete process.env.CI;
  else process.env.CI = originalCI;
});

test("install commands reject shell syntax and malformed tags", () => {
  for (const tag of ["v1.2.3;id", "$(id)", "v1.2.3\n", "main", "--help", "v1.2.3-rc.1"]) {
    expect(() => installCommand(tag)).toThrow();
  }
  expect(installCommand("v0.10.0")).toEndWith("--tag v0.10.0 --locked");
});

test("release lookup excludes drafts and untrusted tag text", async () => {
  globalThis.fetch = (async (_url, options) => {
    expect(options?.redirect).toBe("error");
    expect(options?.signal).toBeDefined();
    return Response.json([
      { tag_name: "v9.0.0", draft: true },
      { tag_name: "v1.2.3;id", draft: false },
      { tag_name: "v0.10.0", draft: false },
    ]);
  });
  expect(await latestAhuTag()).toBe("v0.10.0");
});

test("CI refuses publication when release lookup fails", async () => {
  process.env.CI = "true";
  globalThis.fetch = (async () => new Response("unavailable", { status: 503 }));
  await expect(latestAhuTag()).rejects.toThrow("Could not resolve");
});

test("local fallback uses a published tag rather than the artwork version", async () => {
  delete process.env.CI;
  globalThis.fetch = (async () => new Response("unavailable", { status: 503 }));
  expect(await latestAhuTag()).toBe("v0.11.0");
});
