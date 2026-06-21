import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";
import "@/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://softwaros-nextjs.vercel.app"),
  title: "SoftwareOS — Shortcuts, Comparisons & Pricing for Every App",
  description:
    "Discover, compare, and read reviews for 180+ software tools. The operating system for software knowledge with AI comparisons, shortcuts, and pricing tracking.",
  openGraph: {
    title: "SoftwareOS — Shortcuts, Comparisons & Pricing for Every App",
    description:
      "Discover, compare, and read reviews for 180+ software tools. AI-powered comparisons, master shortcuts, track pricing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftwareOS — Shortcuts, Comparisons & Pricing for Every App",
    description:
      "Discover, compare, and read reviews for 180+ software tools. AI-powered comparisons, master shortcuts, track pricing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}

