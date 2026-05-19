"use client";

import Link from "next/link";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-16">
    <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      <div className="col-span-2 md:col-span-1">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">█</span>
          <span>SoftwareOS</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-3 max-w-[220px]">
          The operating system for software knowledge. Shortcuts, AI comparisons, pricing.
        </p>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Product
        </div>
        <ul className="space-y-2">
          <li><Link href="/" className="hover:text-primary transition">Apps</Link></li>
          <li><a href="/#categories" className="hover:text-primary transition">Categories</a></li>
          <li><Link href="/gestures" className="hover:text-primary transition">Gestures</Link></li>
          <li><a href="/#pricing-plans" className="hover:text-primary transition">Pricing</a></li>
        </ul>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Resources
        </div>
        <ul className="space-y-2">
          <li><a href="/sitemap.xml" className="hover:text-primary transition">Sitemap</a></li>
          <li><a href="/robots.txt" className="hover:text-primary transition">Robots</a></li>
          <li><a href="https://docs.lovable.dev" target="_blank" rel="noreferrer" className="hover:text-primary transition">Docs</a></li>
        </ul>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Legal
        </div>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
          <li><a href="#" className="hover:text-primary transition">Terms</a></li>
          <li><a href="mailto:hello@softwaros.app" className="hover:text-primary transition">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} SoftwareOS — all rights reserved.</div>
        <div className="font-mono text-[10px]">v2.0 · Updated 2026</div>
      </div>
    </div>
  </footer>
);
