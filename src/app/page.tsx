"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSoftwareList } from "@/hooks/useSoftware";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ParticleField } from "@/components/ParticleField";
import { FloatingKeys } from "@/components/FloatingKeys";
import { AICouncil } from "@/components/AICouncil";
import { HotNewSection } from "@/components/HotNewSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { useReveal, useCountUp } from "@/hooks/useReveal";

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStart(true); io.disconnect(); } },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const numRef = useCountUp(to, 1800, start);
  return (
    <div ref={wrapRef} className="inline-flex items-baseline">
      <span ref={numRef} className="gradient-text-orange tabular-nums">0</span>
      <span className="gradient-text-orange">{suffix}</span>
    </div>
  );
};

const Home = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const { data, isLoading } = useSoftwareList();
  const pageRef = useReveal<HTMLDivElement>();

  const categories = useMemo(() => {
    const set = new Set((data ?? []).map((s) => s.category));
    return ["all", ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((s) => {
      const matchCat = cat === "all" || s.category === cat;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.category.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [data, q, cat]);

  return (
    <div ref={pageRef}>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border min-h-[88vh] flex items-center">
        <ParticleField />
        <FloatingKeys />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        <div className="container relative py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">v2.0 — now with 4-AI Council</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] max-w-4xl tracking-tight reveal">
            <span className="gradient-text">The operating system for</span>
            <br />
            <span className="gradient-text-orange">software knowledge</span>
            <span className="text-primary animate-blink">_</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl reveal" style={{ transitionDelay: "100ms" }}>
            Master shortcuts. Compare tools with four AIs at once. Track pricing.
            Everything you need to be 10× faster in the apps you live in.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl reveal" style={{ transitionDelay: "200ms" }}>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm">▸</span>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search photoshop, figma, excel..."
                className="pl-8 h-12 font-mono bg-card/60 backdrop-blur-md border-border focus-visible:ring-primary"
              />
            </div>
            <a
              href="#apps"
              className="h-12 px-6 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm font-bold hover:shadow-glow transition-all hover:scale-[1.02]"
            >
              browse all apps →
            </a>
          </div>

          <div className="mt-6 flex gap-2 flex-wrap reveal" style={{ transitionDelay: "300ms" }}>
            {categories.map((c, i) => (
              <button
                key={`category-${i}`}
                onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition ${
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "border-border bg-background/40 backdrop-blur text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { label: "shortcuts indexed", value: 48000, suffix: "+" },
              { label: "categories", value: 500, suffix: "+" },
              { label: "AI council members", value: 4, suffix: "" },
              { label: "tools tracked", value: 10000, suffix: "+" },
            ].map((s, i) => (
              <div key={s.label} className="glass p-4 reveal" style={{ transitionDelay: `${400 + i * 80}ms` }}>
                <div className="text-2xl md:text-3xl font-bold">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT + NEW */}
      <HotNewSection />

      {/* APPS GRID */}
      <section id="apps" className="container py-20 border-t border-border">
        <div className="flex items-end justify-between mb-8 reveal">
          <div>
            <p className="text-primary text-xs font-mono mb-2">$ ls ./apps</p>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Every app you use, indexed.</h2>
          </div>
          <div className="text-xs font-mono text-muted-foreground hidden md:block">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((s, i) => (
              <Link
                key={s.id}
                href={`/software/${s.slug}`}
                className="glass glass-hover p-5 group reveal"
                style={{ transitionDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform">{s.logo ?? "▣"}</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                <div className="mt-4 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                  open ./{s.slug} →
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground font-mono text-sm">
                no matches. try another query.
              </div>
            )}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <CategoryGrid />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* AI COUNCIL */}
      <section className="container py-20 border-t border-border">
        <div className="max-w-2xl mb-10 reveal">
          <p className="text-primary text-xs font-mono mb-2">$ ai-council --convene</p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Four AIs debate. <span className="gradient-text-orange">You decide.</span>
          </h2>
          <p className="text-muted-foreground">
            Every comparison runs in parallel through Gemini, Groq, Mistral and Cohere —
            then reconciled into a single verdict. No more single-model bias.
          </p>
        </div>
        <AICouncil />
      </section>

      {/* PLANS */}
      <section id="pricing-plans" className="container py-20 border-t border-border">
        <div className="reveal mb-10">
          <p className="text-primary text-xs font-mono mb-2">$ softwareos --plans</p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Simple pricing. No surprises.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Free", price: "$0", period: "/forever", features: ["3 AI comparisons / day", "All shortcuts", "Reviews & pricing", "Ad-supported"], cta: "Current plan" },
            { name: "Pro", price: "$9", period: "/month", featured: true, features: ["Unlimited comparisons", "No ads", "Price drop alerts", "Early features"], cta: "Upgrade to Pro" },
            { name: "Teams", price: "$29", period: "/month", features: ["Everything in Pro", "5 user seats", "Shared shortcut decks", "Team analytics"], cta: "Start Teams" },
          ].map((p, i) => (
            <div
              key={p.name}
              className={`glass glass-hover p-6 reveal ${p.featured ? "border-primary/50 shadow-glow" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {p.featured && (
                <div className="text-[10px] font-mono uppercase text-primary mb-2">★ recommended</div>
              )}
              <div className="text-xl font-bold">{p.name}</div>
              <div className="mt-2">
                <span className={`text-4xl font-bold ${p.featured ? "gradient-text-orange" : ""}`}>{p.price}</span>
                <span className="text-muted-foreground text-sm">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f, fIndex) => (
                  <li key={`feature-${fIndex}`} className="flex gap-2">
                    <span className="text-primary">▸</span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled
                className={`mt-6 w-full py-2.5 rounded font-mono text-sm transition ${
                  p.featured
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-glow"
                    : "border border-border text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
