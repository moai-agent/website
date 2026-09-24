import CopyInstall from "@/components/Landing/CopyInstall";
import HeroMoai from "@/components/Landing/HeroMoai";
import SectionDots from "@/components/Landing/SectionDots";
import Network from "@/components/Landing/Network";
import Steps from "@/components/Landing/Steps";
import { REPO_URL } from "@/components/Landing/transcript";
import "@/components/Landing/landing.css";

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={down ? { transform: "rotate(90deg)" } : undefined}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="landing">
      <SectionDots />

      <header className="topbar">
        <span className="topbar-name">moai-agent</span>
        <a href={REPO_URL} className="topbar-link">
          <GitHubMark />
          GitHub
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <HeroMoai />
          <div className="hero-text">
            <h1 className="hero-mark glitch-container glitch-rgb" data-text="ahu">
              ahu
            </h1>
            <p className="hero-line">Cross harness orchestration for harness and model pinned agents.</p>
          </div>
          <a href="#session" className="hero-cue">
            Watch a session
            <Arrow down />
          </a>
        </section>

        <div id="session">
          <Steps />
        </div>

        <Network />

        <section className="close" id="install" aria-labelledby="close-heading">
          <h2 id="close-heading">It’s early. Try it.</h2>
          <CopyInstall />
          <p className="close-needs">
            Needs Rust, Git, and the agent CLIs you already use. Interactive sessions run in cmux.
          </p>
          <a href={REPO_URL} className="close-link">
            <GitHubMark />
            github.com/moai-agent/ahu
            <Arrow />
          </a>
        </section>
      </main>

      <footer className="footer">
        <span>moai-agent</span>
        <a href={REPO_URL}>GitHub</a>
      </footer>
    </div>
  );
}
