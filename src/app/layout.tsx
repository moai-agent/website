import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Lexend } from "next/font/google";
import "./globals.css";

// Atkinson Hyperlegible Mono carries headings, controls, and terminal output;
// Lexend carries body text.
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://moai-agent.com";
const TITLE = "moai-agent / ahu";
const DESCRIPTION =
  "ahu launches named coding agents, each pinned to its harness and model, in a fresh Git worktree per task.";

// Generated into public/ by scripts/generate-og.tsx during `bun run build`.
const OG_IMAGE = {
  url: "/og.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "moai-agent \u2014 ahu",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
