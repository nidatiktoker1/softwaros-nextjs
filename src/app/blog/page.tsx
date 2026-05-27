import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "10 Figma Shortcuts Every Designer Should Know",
      excerpt: "Speed up your design workflow with these essential keyboard shortcuts.",
      date: "2024-01-15",
      readTime: "5 min",
      slug: "figma-shortcuts",
    },
    {
      title: "Comparing AI Coding Assistants: Which One is Right for You?",
      excerpt: "We put Copilot, Claude, and Codeium head-to-head. Here's what we found.",
      date: "2024-01-10",
      readTime: "8 min",
      slug: "ai-coding-assistant-comparison",
    },
    {
      title: "The SoftwareOS Stack: Tools Used to Build This Platform",
      excerpt: "Transparency: here's exactly what we use and why we chose each tool.",
      date: "2024-01-05",
      readTime: "6 min",
      slug: "our-tech-stack",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tips, tricks, and deep dives into the tools and workflows that make us faster.
          </p>
        </div>
      </section>

      <section className="container py-20">
        <div className="max-w-3xl space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="glass glass-hover p-6 rounded-lg group">
              <div className="flex flex-col justify-between h-full">
                <div className="mb-4">
                  <time className="text-xs font-mono text-muted-foreground">{post.date}</time>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-primary transition mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground font-mono">{post.readTime} read</span>
                  <button className="inline-flex items-center gap-1 text-sm font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read article <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-20 border-t border-border text-center">
        <div className="glass glass-hover p-12 rounded-lg">
          <h2 className="text-2xl font-bold gradient-text mb-3">Stay updated</h2>
          <p className="text-muted-foreground mb-6">Get weekly tips on mastering your dev stack.</p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 rounded-lg bg-background/60 border border-border/40 text-sm focus:outline-none focus:border-primary/40"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-mono font-bold hover:shadow-glow transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border/40 text-foreground hover:border-primary/40 font-mono text-sm font-bold transition"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
