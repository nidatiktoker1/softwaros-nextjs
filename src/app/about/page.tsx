import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
            About SoftwareOS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We're on a mission to help developers and teams make smarter software decisions, faster.
          </p>
        </div>
      </section>

      <section className="container py-20">
        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              Too much time is wasted evaluating software. We're building the operating system for software
              knowledge—a single place to discover tools, master shortcuts, compare alternatives, and make
              data-driven decisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">▸</span>
                <span><strong>Tool Discovery:</strong> 200+ tools across 27 categories</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">▸</span>
                <span><strong>AI Comparisons:</strong> 4 AIs debate, you decide</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">▸</span>
                <span><strong>Keyboard Shortcuts:</strong> Master tools 10x faster</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">▸</span>
                <span><strong>Community Reviews:</strong> Real user feedback</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Built for Developers</h2>
            <p className="text-muted-foreground">
              Whether you're a solo developer, startup, or enterprise team, we help you ship faster by eliminating
              tool evaluation friction and keeping your team aligned on the stack.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20 border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">Ready to master your tools?</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm font-bold hover:shadow-glow transition"
          >
            Explore 180+ tools →
          </Link>
        </div>
      </section>
    </div>
  );
}
