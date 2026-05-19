import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useCategories, useSoftwareByCategory } from "@/hooks/useSoftware";
import { Seo } from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";

type FAQItem = { question: string; answer: string };
type CategoryGuide = { paragraphs: string[]; faq: FAQItem[] };

const categoryGuides: Record<string, CategoryGuide> = {
  vpn: {
    paragraphs: [
      "Look for fast server networks, strong encryption, and a verified no-logs policy when choosing a VPN. The best services balance privacy, streaming performance, and ease of use.",
      "A useful VPN should offer wide geographic coverage, stable mobile and desktop apps, and reliable speeds for streaming, gaming, and remote work. Multi-device support is a major plus.",
      "Pay attention to pricing tiers, free trial options, and ongoing promotions. Services with long-term savings and transparent refund terms tend to be the best value in 2026.",
    ],
    faq: [
      { question: "Why should I use a VPN?", answer: "VPNs protect your internet traffic, mask your IP address, and help you access geo-restricted content securely." },
      { question: "Does VPN slow down my connection?", answer: "A small speed drop is normal, but top VPNs keep latency low and optimize routing for streaming and gaming." },
      { question: "Is a free VPN safe?", answer: "Free VPNs often have limits or privacy tradeoffs, so paid providers are typically safer and more reliable." },
      { question: "Can I use a VPN on mobile?", answer: "Yes. Most leading VPNs offer dedicated iOS and Android apps with the same privacy protections as desktop versions." },
      { question: "What is split tunneling?", answer: "Split tunneling lets you route only certain apps through the VPN while keeping other traffic on your normal connection." },
    ],
  },
  design: {
    paragraphs: [
      "Choose software that supports collaboration, fast prototyping, and a flexible artboard workflow. The best design tools make handoffs and team reviews painless.",
      "Browser-based apps with cloud file storage can simplify teamwork, while desktop-native tools may offer more performance and offline editing power.",
      "Check for strong plugin ecosystems, reusable component libraries, and export options for development teams to save time across product launches.",
    ],
    faq: [
      { question: "What is the best design tool for teams?", answer: "Tools with real-time collaboration and commenting are ideal for teams, especially when they support shared libraries and design systems." },
      { question: "Do I need a paid plan?", answer: "Free plans are great for individuals, but professionals often need paid tiers for unlimited projects, version history, and team features." },
      { question: "Can I use design software in a browser?", answer: "Yes. Several leading products run in the browser and keep files synced in the cloud for easy access from anywhere." },
      { question: "How important are plugins?", answer: "Plugins extend functionality for animation, illustration, and developer handoff, so a rich plugin marketplace is very helpful." },
      { question: "Is vector design different from raster design?", answer: "Yes. Vector tools are best for icons and UI work, while raster tools are better for photo editing and pixel-based art." },
    ],
  },
  productivity: {
    paragraphs: [
      "A strong productivity app should combine notes, tasks, and automation while staying easy to organize. Search and templates are essential for daily workflows.",
      "Cross-platform access and offline support make it easier to stay productive from desktop, mobile, or the browser. Look for tools with great integrations.",
      "Security and data portability matter, especially if you rely on your workspace for both personal and team projects. Choose apps with solid sync and export options.",
    ],
    faq: [
      { question: "What makes a good productivity app?", answer: "The best apps help you organize work, capture ideas quickly, and connect tasks with documents and calendars." },
      { question: "Can I use one workspace for notes and tasks?", answer: "Yes — many modern apps let you manage notes, projects, and to-do lists in the same place." },
      { question: "Do productivity tools support teams?", answer: "Top tools offer shared workspaces, permissions, and collaboration features for remote teams." },
      { question: "Should I choose cloud-based or local storage?", answer: "Cloud storage offers sync across devices, while local storage can be better for privacy and offline access." },
      { question: "How do I move my data later?", answer: "Look for apps with export tools and open formats so you can switch platforms without losing your work." },
    ],
  },
  development: {
    paragraphs: [
      "Pick an editor or IDE that supports your main languages, integrates with version control, and offers smart code completion. Performance matters for large projects.",
      "Extensions and workspace customization let you tailor the developer experience for frontend, backend, and full-stack workflows.",
      "Debugging, terminal access, and Git integration are major productivity boosters. The best development tools bring these features together in one interface.",
    ],
    faq: [
      { question: "Should I use an IDE or a code editor?", answer: "IDEs are powerful for large projects, while lightweight editors are faster for quick tasks and scripting." },
      { question: "Do I need Git support built in?", answer: "Built-in Git saves time, but many tools also work with external Git clients if you prefer a separate workflow." },
      { question: "What makes a good extension system?", answer: "A great system lets you add language support, linters, debuggers, and themes without slowing down the editor." },
      { question: "Can I use a developer tool on multiple platforms?", answer: "Yes — cross-platform support is useful so you can work consistently on Windows, macOS, or Linux." },
      { question: "Is performance important for editors?", answer: "Absolutely — fast startup, low memory usage, and responsive editing make development smoother." },
    ],
  },
};

const getPriceLabel = (software: { pricing?: { price: number; period: string }[] }) => {
  const price = software.pricing?.[0];
  if (!price) return "—";
  return price.price === 0 ? "Free" : `$${price.price}/${price.period}`;
};

const hasFreeTier = (software: { pricing?: { price: number }[] }) =>
  (software.pricing ?? []).some((tier) => tier.price === 0) ? "Yes" : "No";

const getTrustScore = (software: unknown) => {
  const trust = (software as { trust_score?: number }).trust_score;
  return typeof trust === "number" ? trust.toFixed(1) : "—";
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useCategories();
  const { data: software = [], isLoading } = useSoftwareByCategory(slug);

  const category = useMemo(
    () => (categories ?? []).find((c) => c.slug === slug),
    [categories, slug],
  );

  const categoryName = category?.name ?? (slug ?? "").replace(/-/g, " ");
  const prettyName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const guide = categoryGuides[slug ?? ""] ?? {
    paragraphs: [
      `Explore the best ${prettyName} apps to find tools with strong features, intuitive design, and reliable support.`,
      "Look for software that supports your workflow, scales with your needs, and keeps data synced across devices.",
      "Check pricing, trial options, and long-term value before committing to a new product.",
    ],
    faq: [
      { question: "How do I choose the right app?", answer: "Compare features, pricing, and compatibility with your workflow to find the best fit for your needs." },
      { question: "Are paid plans worth it?", answer: "Paid plans usually unlock advanced features, better performance, and improved support for teams." },
      { question: "Can I switch tools later?", answer: "Yes — look for apps with export options so your data stays portable if you change platforms." },
      { question: "What should I test first?", answer: "Try the interface, collaboration features, and integration options before committing to a long-term plan." },
      { question: "Should I choose browser-based or desktop apps?", answer: "Choose browser-based for fast collaboration and desktop apps for offline work and performance." },
    ],
  };

  return (
    <div className="container py-16">
      <Seo
        title={`Best ${prettyName} Software 2026 — SoftwareOS`}
        description={`Compare the best ${prettyName} software. Shortcuts, pricing, reviews and AI-powered comparisons.`}
      />

      <nav className="text-xs font-mono text-muted-foreground mb-4 flex flex-wrap gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <Link href="/?cat=all#apps" className="hover:text-primary">Categories</Link>
        <span>›</span>
        <span className="text-white">{prettyName}</span>
      </nav>

      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Best {prettyName} Software 2026</h1>
        <p className="text-muted-foreground mb-6">
          {software.length} {software.length === 1 ? "tool" : "tools"} compared · Updated May 2026
        </p>
        <p className="text-muted-foreground max-w-3xl">
          {category?.description ?? `Hand-picked ${prettyName} apps with shortcuts, pricing and AI comparisons.`}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)
        ) : software.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-mono text-sm col-span-full">
            <p className="text-lg font-semibold mb-2">🔜 Coming Soon</p>
            <p>More {prettyName} tools are coming soon. Check back later!</p>
          </div>
        ) : (
          software.map((s) => (
            <Link key={s.id} href={`/software/${s.slug}`} className="glass glass-hover p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform">{s.logo ?? "▣"}</div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5 rounded">
                  {s.category}
                </span>
              </div>
              <h3 className="font-bold text-lg group-hover:text-primary transition">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
              <div className="mt-4 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition">
                open ./{s.slug} →
              </div>
            </Link>
          ))
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-5">Comparison table</h2>
        <div className="overflow-x-auto rounded-3xl border border-border bg-[#0d0d0d]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-[#111111] text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Free Tier</th>
                <th className="px-4 py-3">Trust Score</th>
                <th className="px-4 py-3">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {software.map((s) => (
                <tr key={s.id} className="bg-[#111111] text-white">
                  <td className="px-4 py-4 font-medium">{s.name}</td>
                  <td className="px-4 py-4 text-muted-foreground">{getPriceLabel(s)}</td>
                  <td className="px-4 py-4 text-muted-foreground">{hasFreeTier(s)}</td>
                  <td className="px-4 py-4 text-muted-foreground">{getTrustScore(s)}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/software/${s.slug}`}
                      className="inline-flex items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-mono text-primary hover:bg-primary/10 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3 mb-12">
        {guide.paragraphs.map((paragraph, index) => (
          <div key={index} className="glass p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{paragraph}</p>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-5">FAQ</h2>
        <div className="grid gap-4">
          {guide.faq.map((item, index) => (
            <div key={index} className="glass p-5">
              <p className="text-sm font-semibold text-white mb-2">{item.question}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Category;
