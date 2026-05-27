"use client";
import Link from "next/link";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have a question? Want to partner? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-mono text-sm">Email</p>
                    <a href="mailto:hello@softwaros.com" className="text-muted-foreground hover:text-primary transition">
                      hello@softwaros.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-border/40 rounded-lg hover:border-primary/40 transition text-sm"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-border/40 rounded-lg hover:border-primary/40 transition text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-border/40 rounded-lg hover:border-primary/40 transition text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="glass glass-hover p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-muted-foreground hover:text-primary transition py-2 border-b border-border/40 last:border-0"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition py-2 border-b border-border/40 last:border-0"
              >
                About
              </Link>
              <Link
                href="/compare"
                className="block text-muted-foreground hover:text-primary transition py-2 border-b border-border/40 last:border-0"
              >
                Compare Tools
              </Link>
              <Link
                href="/shortcuts"
                className="block text-muted-foreground hover:text-primary transition py-2 border-b border-border/40 last:border-0"
              >
                Keyboard Shortcuts
              </Link>
              <Link
                href="/pricing"
                className="block text-muted-foreground hover:text-primary transition py-2 border-b border-border/40 last:border-0"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20 border-t border-border">
        <div className="glass glass-hover p-12 text-center rounded-lg">
          <h2 className="text-3xl font-bold gradient-text mb-3">Interested in Partnership?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We're looking for integrations, partnerships, and feedback. Let's build something great together.
          </p>
          <a
            href="mailto:partnerships@softwaros.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm font-bold hover:shadow-glow transition"
          >
            Start a conversation →
          </a>
        </div>
      </section>
    </div>
  );
}
