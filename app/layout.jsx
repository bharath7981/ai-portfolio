import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://bharath-portfolio-umber.vercel.app"),
  title: "Bharath Rasalapu | AI & ML Engineer • Full Stack Architect",
  description:
    "Portfolio of Bharath Rasalapu — AI/ML Engineer specializing in autonomous multi-agent systems (LangGraph), two-stage RAG architectures, and production full-stack engineering.",
  keywords: [
    "Bharath Rasalapu",
    "AI Engineer",
    "ML Engineer",
    "LangGraph",
    "RAG",
    "FastAPI",
    "Next.js",
    "Python",
    "Autonomous Agents",
    "Machine Learning",
  ],
  authors: [{ name: "Bharath Rasalapu" }],
  creator: "Bharath Rasalapu",
  openGraph: {
    title: "Bharath Rasalapu | AI & ML Engineer • Full Stack Architect",
    description:
      "Autonomous AI Agents, Two-Stage Vector RAG, and Production Engineering. Open for full-time AI/ML engineering roles.",
    url: "https://bharath-portfolio-umber.vercel.app",
    siteName: "Bharath Rasalapu Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharath Rasalapu | AI & ML Engineer",
    description:
      "Autonomous AI Agents, Two-Stage Vector RAG, and Production Engineering. Open for full-time AI/ML engineering roles.",
    creator: "@bharath7981",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
