"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSoftwareList } from "@/hooks/useSoftware";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight } from "lucide-react";

export default function ShortcutsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { data: software, isLoading } = useSoftwareList();

  const categories = useMemo(() => {
    const cats = new Set((software ?? []).map((s) => s.category));
    return ["all", ...Array.from(cats).sort()];
  }, [software]);

  const filtered = useMemo(() => {
    return (software ?? [])
      .filter((s) => categoryFilter === "all" || s.category === categoryFilter)
      .filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase())
      );
  }, [software, search, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">keyboard mastery</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-2xl reveal">
            <span className="gradient-text">Master 180+</span>
            <br />
            <span className="gradient-text-orange">apps with shortcuts</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl reveal">
            Find and learn keyboard shortcuts for every tool you use. Windows, Mac, Linux shortcuts all in one place.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container py-10 border-b border-border/40">
        <div className="max-w-2xl">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find shortcuts for figma, photoshop, vs code..."
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "border-border bg-background/40 backdrop-blur text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools List */}
      <section className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-32" />)
            : filtered.length === 0
            ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p>No tools found matching your search.</p>
                <p className="text-sm mt-2">Try a different search or filter.</p>
              </div>
            )
            : filtered.map((tool) => (
              <Link
                key={tool.id}
                href={`/software/${tool.slug}/shortcuts`}
                className="glass glass-hover p-5 group rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{tool.logo ?? "▣"}</div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5 rounded">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {tool.description || "Keyboard shortcuts available"}
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View shortcuts <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Tips */}
      <section className="container py-20 border-t border-border">
        <h2 className="text-3xl font-bold gradient-text mb-10">Pro Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Learn by category",
              desc: "Master design tools, then dev tools. Organize your learning by workflow.",
            },
            {
              title: "Keyboard > Mouse",
              desc: "Shortcuts can 2-3x your speed. Invest 15 mins per app and you'll save hours.",
            },
            {
              title: "Custom shortcuts",
              desc: "Most apps let you remap shortcuts. Use what makes sense for your workflow.",
            },
            {
              title: "Practice regularly",
              desc: "Print the shortcut cheat sheet. Keep it visible while you work.",
            },
          ].map((tip, i) => (
            <div key={i} className="glass glass-hover p-5 rounded-lg">
              <h4 className="font-bold mb-2">{tip.title}</h4>
              <p className="text-sm text-muted-foreground">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 border-t border-border">
        <div className="glass glass-hover p-12 text-center rounded-lg">
          <h2 className="text-3xl font-bold gradient-text mb-3">
            Save time with keyboard shortcuts
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Every second saved compounds. Master shortcuts and ship 10× faster.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm font-bold hover:shadow-glow transition"
          >
            Back to all apps
          </Link>
        </div>
      </section>
    </div>
  );
}
