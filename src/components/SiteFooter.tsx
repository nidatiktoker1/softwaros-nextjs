"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-16">
    <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      <div className="col-span-2 md:col-span-1">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">█</span>
          <span>SoftwareOS</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-3 max-w-[220px]">
          Discover, compare, and read reviews for 180+ software tools. Master shortcuts, get AI comparisons, track pricing.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="mailto:hello@softwaros.com" className="text-muted-foreground hover:text-primary transition">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Product
        </div>
        <ul className="space-y-2">
          <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
          <li><Link href="/compare" className="hover:text-primary transition">Compare</Link></li>
          <li><Link href="/shortcuts" className="hover:text-primary transition">Shortcuts</Link></li>
          <li><Link href="/pricing" className="hover:text-primary transition">Pricing</Link></li>
        </ul>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Company
        </div>
        <ul className="space-y-2">
          <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
          <li><Link href="/blog" className="hover:text-primary transition">Blog</Link></li>
          <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
        </ul>
      </div>

      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Legal
        </div>
        <ul className="space-y-2">
          <li><Link href="/privacy" className="hover:text-primary transition">Privacy</Link></li>
          <li><Link href="/terms" className="hover:text-primary transition">Terms</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} SoftwareOS — all rights reserved.</div>
        <div className="font-mono text-[10px]">v2.0 · Made with ♦ for developers</div>
      </div>
    </div>
  </footer>
);
