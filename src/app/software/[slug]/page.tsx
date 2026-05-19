"use client";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useSoftware, useSoftwareList, useShortcutsForSoftware } from "@/hooks/useSoftware";
import { Seo } from "@/components/Seo";

type Shortcut = { action: string; keys: string };
type ShortcutSet = { windows: Shortcut[]; mac?: Shortcut[] };
type PricingTierExtended = { tier: string; price: number; period: string; description?: string };

type Override = {
  tagline?: string;
  about?: string;
  bestFor?: string[];
  headlinePrice?: string;
  freeTier?: string;
  trustScore?: number;
  learningCurve?: string;
  pros?: string[];
  cons?: string[];
  pricing?: PricingTierExtended[];
  shortcuts?: ShortcutSet;
  totalShortcuts?: number;
  alternatives?: { slug: string; name: string; tagline: string; price: string }[];
};

const overrides: Record<string, Override> = {
  nordvpn: {
    tagline: "Privacy-first VPN with global reach",
    about:
      "NordVPN is a Panama-based VPN with 6,000+ servers in 60+ countries. It offers AES-256 encryption and a verified no-logs policy. Best for streaming, privacy, and remote work.",
    bestFor: ["Privacy", "Streaming", "Remote Work", "Security", "Travel"],
    headlinePrice: "$3.99/mo",
    freeTier: "No free tier",
    trustScore: 9.2,
    learningCurve: "Easy to learn",
    pros: [
      "Fast speeds",
      "6000+ servers",
      "Great for streaming",
      "No-logs verified",
      "Easy to use",
    ],
    cons: [
      "No free plan",
      "Expensive multi-device",
      "Occasional drops",
      "No iOS split tunneling",
    ],
    pricing: [
      { tier: "Basic", price: 3.99, period: "mo", description: "VPN + malware protection" },
      { tier: "Plus", price: 4.99, period: "mo", description: "+ password manager" },
      { tier: "Ultimate", price: 6.99, period: "mo", description: "+ 1TB cloud storage" },
    ],
    shortcuts: {
      windows: [
        { keys: "Ctrl+Alt+C", action: "Connect" },
        { keys: "Ctrl+Alt+D", action: "Disconnect" },
        { keys: "Ctrl+Alt+K", action: "Kill switch" },
        { keys: "Ctrl+Alt+S", action: "Settings" },
        { keys: "Ctrl+Alt+Q", action: "Quit" },
      ],
      mac: Array.from({ length: 22 }, (_, index) => ({ action: `Shortcut ${index + 6}`, keys: `Cmd+Alt+${index + 6}` })),
    },
    totalShortcuts: 27,
    alternatives: [
      { slug: "expressvpn", name: "ExpressVPN", tagline: "Fastest speeds", price: "$6.67/mo" },
      { slug: "surfshark", name: "Surfshark", tagline: "Unlimited devices", price: "$2.49/mo" },
      { slug: "protonvpn", name: "ProtonVPN", tagline: "Best free tier", price: "$4.99/mo" },
    ],
  },
  expressvpn: {
    tagline: "World's fastest VPN",
    about:
      "ExpressVPN runs its proprietary Lightway protocol on 3,000+ servers across 105 countries. TrustedServer tech wipes drives on every reboot for maximum privacy, and the apps are some of the most polished in the category — making it a default pick for streaming and travel.",
    bestFor: ["Streaming", "Travel", "Privacy", "Speed", "Support"],
    headlinePrice: "$6.67/mo",
    freeTier: "No free tier",
    trustScore: 9.0,
    learningCurve: "Easy",
    pros: [
      "Fastest speeds",
      "Best for streaming",
      "Works everywhere",
      "Great support",
      "Simple app",
    ],
    cons: [
      "Most expensive",
      "Only 8 devices",
      "Owned by Kape",
      "No free tier",
    ],
    pricing: [
      { tier: "1 Month", price: 12.95, period: "mo", description: "$12.95/mo" },
      { tier: "6 Months", price: 9.99, period: "mo", description: "$9.99/mo" },
      { tier: "12 Months", price: 6.67, period: "mo", description: "Most popular" },
    ],
    shortcuts: {
      windows: [
        { keys: "Ctrl+Alt+C", action: "Connect" },
        { keys: "Ctrl+Alt+D", action: "Disconnect" },
        { keys: "Ctrl+Alt+K", action: "Kill switch" },
        { keys: "Ctrl+Alt+S", action: "Settings" },
        { keys: "Ctrl+Alt+Q", action: "Quit" },
      ],
    },
    totalShortcuts: 5,
    alternatives: [
      { slug: "nordvpn", name: "NordVPN", tagline: "Best all-rounder", price: "$3.99/mo" },
      { slug: "surfshark", name: "Surfshark", tagline: "Unlimited devices", price: "$2.49/mo" },
      { slug: "protonvpn", name: "ProtonVPN", tagline: "Best free tier", price: "$4.99/mo" },
    ],
  },
  figma: {
    tagline: "Design tool built for teams",
    about:
      "Figma is the browser-based design platform that pioneered real-time multiplayer design. With Auto Layout, Variables, Dev Mode, and a massive plugin ecosystem, it has become the industry standard for product and UI teams of every size.",
    bestFor: ["UI Design", "Collaboration", "Prototyping", "Designer teams", "Plugins"],
    headlinePrice: "Free",
    freeTier: "Free tier available",
    trustScore: 9.5,
    learningCurve: "Medium",
    pros: [
      "Best collaboration",
      "Free tier",
      "Browser-based",
      "Huge plugins",
      "Industry standard",
    ],
    cons: [
      "Slow on large files",
      "Needs internet",
      "Expensive for teams",
      "No offline mode",
    ],
    pricing: [
      { tier: "Free", price: 0, period: "mo", description: "Up to 3 files" },
      { tier: "Professional", price: 12, period: "mo", description: "Most popular" },
      { tier: "Organization", price: 45, period: "mo", description: "Enterprise teams" },
    ],
    shortcuts: {
      windows: [
        { keys: "Ctrl+C", action: "Copy" },
        { keys: "Ctrl+V", action: "Paste" },
        { keys: "Ctrl+Z", action: "Undo" },
        { keys: "Ctrl+D", action: "Duplicate" },
        { keys: "Ctrl+G", action: "Group" },
      ],
    },
    totalShortcuts: 5,
    alternatives: [
      { slug: "canva", name: "Canva", tagline: "Easy graphics", price: "$12.99/mo" },
      { slug: "adobe-xd", name: "Adobe XD", tagline: "UI & UX design", price: "$9.99/mo" },
      { slug: "sketch", name: "Sketch", tagline: "macOS-native UI design", price: "$10/mo" },
    ],
  },
  notion: {
    tagline: "All-in-one workspace",
    about:
      "Notion combines notes, docs, wikis, projects, and databases into a single flexible workspace. Built-in AI helps draft and summarize, while a huge template gallery and relational databases make it equally good for personal use and full team operations.",
    bestFor: ["Notes", "Wikis", "Project Management", "Teams", "AI"],
    headlinePrice: "Free",
    freeTier: "Free tier available",
    trustScore: 8.9,
    learningCurve: "Medium",
    pros: [
      "Very flexible",
      "Great templates",
      "Good free tier",
      "AI features",
      "Cross-platform",
    ],
    cons: [
      "Overwhelming",
      "Slow mobile",
      "No offline desktop",
      "Complex permissions",
    ],
    pricing: [
      { tier: "Free", price: 0, period: "mo", description: "Basic access" },
      { tier: "Plus", price: 10, period: "mo", description: "Most popular" },
      { tier: "Business", price: 15, period: "mo", description: "Team productivity" },
    ],
    shortcuts: {
      windows: [
        { keys: "Ctrl+N", action: "New page" },
        { keys: "Ctrl+P", action: "Search" },
        { keys: "Ctrl+/", action: "Commands" },
        { keys: "Ctrl+D", action: "Duplicate" },
        { keys: "Ctrl+[", action: "Back" },
      ],
    },
    totalShortcuts: 5,
    alternatives: [
      { slug: "obsidian", name: "Obsidian", tagline: "Local-first notes", price: "$0" },
      { slug: "confluence", name: "Confluence", tagline: "Team collaboration", price: "$10/mo" },
      { slug: "coda", name: "Coda", tagline: "Docs that act like apps", price: "$10/mo" },
    ],
  },
  "vs-code": {
    tagline: "Free code editor by Microsoft",
    about:
      "Visual Studio Code is Microsoft's free, open-source code editor with first-class support for nearly every language via its massive extension marketplace. IntelliSense, integrated Git, and remote development make it the default editor for millions of developers.",
    bestFor: ["Developer tools", "Extensions", "Git", "Web dev", "Cross-platform"],
    headlinePrice: "Free",
    freeTier: "Free tier available",
    trustScore: 9.7,
    learningCurve: "Medium",
    pros: [
      "Completely free",
      "Best extensions",
      "IntelliSense",
      "Git built in",
      "Huge community",
    ],
    cons: [
      "High RAM",
      "Complex for beginners",
      "Slow cold start",
      "No cloud sync default",
    ],
    pricing: [
      { tier: "Free forever", price: 0, period: "mo", description: "All core features" },
      { tier: "Extensions", price: 2, period: "mo", description: "Optional paid extensions" },
      { tier: "Marketplace", price: 20, period: "mo", description: "Premium tools" },
    ],
    shortcuts: {
      windows: [
        { keys: "Ctrl+P", action: "Quick open" },
        { keys: "Ctrl+Shift+P", action: "Commands" },
        { keys: "Ctrl+`", action: "Terminal" },
        { keys: "Ctrl+B", action: "Sidebar" },
        { keys: "Ctrl+Z", action: "Undo" },
      ],
    },
    totalShortcuts: 5,
    alternatives: [
      { slug: "webstorm", name: "WebStorm", tagline: "Smart IDE", price: "$59/mo" },
      { slug: "sublime-text", name: "Sublime Text", tagline: "Fast lightweight editor", price: "$99 one-time" },
      { slug: "vim", name: "Vim", tagline: "Keyboard-driven editor", price: "$0" },
    ],
  },
};

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="glass p-4 text-center">
    <div className="text-xl md:text-2xl font-bold gradient-text-orange">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">{label}</div>
  </div>
);

const KeyChip = ({ keys }: { keys: string }) => (
  <span className="inline-flex items-center gap-1">
    {keys.split("+").map((k, i, arr) => (
      <span key={i} className="inline-flex items-center">
        <kbd className="px-2 py-1 rounded border border-border bg-card font-mono text-[11px] text-foreground shadow-sm">
          {k.trim()}
        </kbd>
        {i < arr.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
      </span>
    ))}
  </span>
);

const SoftwareHub = () => {
  const { slug } = useParams();
  // Allow /software/vscode → vs-code in DB
  const dbSlug = slug === "vscode" ? "vs-code" : slug;
  const { data, isLoading } = useSoftware(dbSlug);
  const { data: allSoftware } = useSoftwareList();
  const { data: dbShortcuts = [] } = useShortcutsForSoftware(data?.slug);

  if (isLoading) return <div className="container py-12 font-mono text-muted-foreground">$ loading...</div>;
  if (!data) return notFound();

  const ov = overrides[data.slug] ?? {};
  const trust = ov.trustScore ?? (data as unknown as { trust_score?: number }).trust_score ?? null;
  const learning = ov.learningCurve ?? (data as unknown as { learning_curve?: string }).learning_curve ?? "Medium";
  const pros = ov.pros ?? ((data as unknown as { pros?: string[] }).pros) ?? [];
  const cons = ov.cons ?? ((data as unknown as { cons?: string[] }).cons) ?? [];
  const pricing = (ov.pricing ?? data.pricing ?? []) as PricingTierExtended[];

  const headlinePrice =
    ov.headlinePrice ??
    (pricing[0]?.price === 0 ? "Free" : pricing[0] ? `$${pricing[0].price}/mo` : "—");
  const freeTier = ov.freeTier ?? (pricing.some((p) => p.price === 0) ? "Free tier available" : "No free tier");

  // Count shortcuts from database
  const windowsCount = dbShortcuts?.filter((s: any) => s.os === 'windows').length ?? 0;
  const macCount = dbShortcuts?.filter((s: any) => s.os === 'mac').length ?? 0;
  const winShortcuts = (ov.shortcuts?.windows ?? data.shortcuts?.windows ?? []).slice(0, 5);
  const totalShortcuts = ov.totalShortcuts ?? windowsCount + macCount;

  // Resolve alternatives: prefer overrides, fallback to competitors that exist in DB
  const altList =
    ov.alternatives ??
    (data.competitors ?? [])
      .map((c) => (allSoftware ?? []).find((s) => s.slug === c || s.name.toLowerCase() === c.toLowerCase()))
      .filter(Boolean)
      .slice(0, 3)
      .map((s) => ({
        slug: s!.slug,
        name: s!.name,
        tagline: s!.description?.slice(0, 40) ?? "",
        price: "—",
      }));

  const title = `${data.name} — Shortcuts, Reviews, Pricing & AI Comparisons | SoftwareOS`;
  const description = `Everything about ${data.name}: keyboard shortcuts (Windows + Mac), real user reviews, current pricing tiers, and 4-AI head-to-head comparisons.`;
  const url = typeof window !== "undefined" ? window.location.href : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.name,
    applicationCategory: data.category,
    description: ov.about ?? data.description,
    operatingSystem: "Windows, macOS",
    aggregateRating: trust
      ? { "@type": "AggregateRating", ratingValue: trust, bestRating: 10, ratingCount: 100 }
      : undefined,
    offers: pricing.map((p) => ({
      "@type": "Offer",
      name: p.tier,
      price: p.price,
      priceCurrency: "USD",
    })),
  };

  const sections = [
    {
      to: `/software/${data.slug}/shortcuts`,
      label: "Shortcuts",
      emoji: "⌨",
      desc: `${windowsCount} Windows · ${macCount} Mac`,
    },
    { to: `/software/${data.slug}/reviews`, label: "Reviews", emoji: "★", desc: "Real user reviews & ratings" },
    { to: `/software/${data.slug}/pricing`, label: "Pricing", emoji: "$", desc: `${pricing.length} plans · alerts available` },
  ];

  return (
    <div className="container py-12 max-w-5xl">
      <Seo title={title} description={description} schema={schema} canonical={url} />

      <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-primary">← cd ..</Link>
      <div className="text-xs font-mono text-muted-foreground mt-2 mb-4">
        <Link href="/" className="hover:text-primary">Home</Link> <span className="px-2">&gt;</span> {data.category} <span className="px-2">&gt;</span> <span className="text-white font-semibold">{data.name}</span>
      </div>

      <header className="mt-4 mb-8 flex items-start gap-5 flex-wrap">
        <div className="text-6xl">{data.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/40 px-2 py-0.5 rounded">
              {data.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">{data.name}</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">{ov.tagline ?? data.description}</p>
        </div>
      </header>

      {/* 3 feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {sections.map((s) => (
          <Link key={s.to} href={s.to} className="glass glass-hover p-6 group">
            <div className="text-3xl mb-3">{s.emoji}</div>
            <div className="font-bold group-hover:text-primary transition">{s.label}</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">{s.desc}</div>
            <div className="text-xs font-mono text-primary mt-4 opacity-0 group-hover:opacity-100 transition">
              open →
            </div>
          </Link>
        ))}
      </section>

      {/* 1. Quick stats bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <StatBox value={headlinePrice} label="Price" />
        <StatBox value={freeTier} label="Free tier" />
        <StatBox value={learning} label="Ease" />
        <StatBox value={trust ? `${Number(trust).toFixed(1)}/10` : "—"} label="Trust score" />
      </section>

      {/* 2. About */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">About {data.name}</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">{ov.about ?? data.description}</p>
      </section>

      {/* 3. Best for tags */}
      {ov.bestFor && ov.bestFor.length > 0 && (
        <section className="mb-12">
          <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">Best for</h3>
          <div className="flex flex-wrap gap-2">
            {ov.bestFor.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full text-xs font-mono border border-primary/40 text-primary bg-primary/5"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Pros & cons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="glass p-6">
          <h3 className="font-bold mb-4 text-green-400">Pros</h3>
          <ul className="space-y-2">
            {pros.map((p) => (
              <li key={p} className="flex gap-2 text-sm">
                <span className="text-green-400 shrink-0">✓</span>
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-6">
          <h3 className="font-bold mb-4 text-red-400">Cons</h3>
          <ul className="space-y-2">
            {cons.map((c) => (
              <li key={c} className="flex gap-2 text-sm">
                <span className="text-red-400 shrink-0">✗</span>
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Pricing tiers */}
      {pricing.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricing.slice(0, 3).map((p, i) => {
              const featured = p.description?.toLowerCase().includes("most popular") || (i === 1 && pricing.length >= 2);
              return (
                <div
                  key={p.tier}
                  className={`glass p-6 relative ${featured ? "border-primary/60 shadow-glow" : ""}`}
                >
                  {featured && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="font-bold text-lg">{p.tier}</div>
                  <div className="mt-2">
                    <span className={`text-3xl font-bold ${featured ? "gradient-text-orange" : ""}`}>
                      {p.price === 0 ? "Free" : `$${p.price}`}
                    </span>
                    {p.price > 0 && <span className="text-muted-foreground text-sm"> /{p.period}</span>}
                  </div>
                  {p.description && <div className="text-sm text-muted-foreground mt-3">{p.description}</div>}
                  <Link
                    href={`/software/${data.slug}/pricing`}
                    className={`mt-5 block text-center py-2 rounded font-mono text-xs transition ${
                      featured
                        ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-glow"
                        : "border border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    See details →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Shortcuts preview */}
      {winShortcuts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5">Top Shortcuts</h2>
          <div className="flex flex-wrap gap-3 mb-5">
            {winShortcuts.map((sc) => (
              <div key={sc.action} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-white">
                <KeyChip keys={sc.keys} />
                <span className="font-medium">{sc.action}</span>
              </div>
            ))}
          </div>
          <Link
            href={`/software/${data.slug}/shortcuts`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-primary/50 text-primary font-mono text-xs hover:bg-primary/10 transition"
          >
            View All {totalShortcuts} Shortcuts →
          </Link>
        </section>
      )}

      {/* 7. Alternatives */}
      {altList.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5">Compare {data.name} With</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {altList.map((a) => (
              <div key={a.slug} className="glass p-5 flex flex-col">
                <div className="font-bold text-lg">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1 flex-1">{a.tagline}</div>
                <div className="text-sm font-mono text-primary mt-3">{a.price}</div>
                <Link
                  href={`/software/${data.slug}/compare/${a.slug}`}
                  className="mt-4 inline-flex items-center justify-center h-9 rounded bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs font-mono font-bold hover:shadow-glow transition"
                >
                  Compare →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.affiliate_link && (
        <a
          href={data.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm hover:shadow-glow transition"
        >
          get {data.name} →
        </a>
      )}
    </div>
  );
};

export default SoftwareHub;
