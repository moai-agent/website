import { AHU_VERSION, REPO_URL } from "./transcript";

const LATEST_RELEASE_API = "https://api.github.com/repos/moai-agent/ahu/releases/latest";

/** Only a plain release tag may reach a command visitors copy into their shell. */
const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;

/**
 * The newest published (non-prerelease) ahu tag, resolved once per `next build`,
 * so the install command floats with each deploy. In CI a failed lookup fails
 * the build and the live site keeps its last good tag; locally it falls back
 * to the version the transcripts follow.
 */
export async function latestAhuTag(): Promise<string> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    // Shared CI runners hit the unauthenticated rate limit; the workflow passes its token.
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(LATEST_RELEASE_API, { headers });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const { tag_name: tag } = (await res.json()) as { tag_name?: unknown };
    if (typeof tag !== "string" || !RELEASE_TAG.test(tag)) {
      throw new Error(`unexpected tag ${JSON.stringify(tag)}`);
    }
    return tag;
  } catch (error) {
    if (process.env.CI) throw new Error(`Could not resolve the latest ahu release: ${error}`);
    console.warn(`Could not resolve the latest ahu release (${error}); using ${AHU_VERSION}.`);
    return AHU_VERSION;
  }
}

export const installCommand = (tag: string) => `cargo install --git ${REPO_URL} --tag ${tag} --locked`;
