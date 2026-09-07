import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";
import "./globals.css";

// Atkinson Hyperlegible carries headings; Lexend carries everything else.
const heading = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

const sans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://moai-agent.com";
const TITLE = "moai-agent";
const DESCRIPTION = "becoming...";

// Generated into public/ by scripts/generate-og.tsx during `bun run build`.
const OG_IMAGE = {
  url: "/og.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "moai-agent \u2014 becoming...",
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
    <html lang="en" className={`${heading.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
