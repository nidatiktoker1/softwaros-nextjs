"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useCategories, useSoftwareByCategory, type Category } from "@/hooks/useSoftware";
import type { Software } from "@/lib/types";
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
  "code-editors": {
    paragraphs: [
      "A great code editor should offer fast syntax highlighting, intelligent autocomplete, and a plugin ecosystem that adapts to your stack. The best editors balance lightweight performance with deep language support.",
      "Look for built-in Git integration, multi-cursor editing, and a strong extension marketplace. Cross-platform editors with cloud-synced settings make it easier to work consistently across machines.",
      "Consider whether you need a lightweight text editor or a full IDE with debugging and build tools built in. Free and open-source options are common in this category, so pricing isn't always the deciding factor.",
    ],
    faq: [
      { question: "What's the difference between a code editor and an IDE?", answer: "A code editor focuses on writing and editing code quickly, while an IDE bundles debugging, build tools, and project management into one application." },
      { question: "Are most code editors free?", answer: "Yes — many popular code editors are free and open source, though some offer paid extensions or enterprise support tiers." },
      { question: "Can I use extensions to add language support?", answer: "Most modern editors support a plugin marketplace where you can add syntax highlighting, linters, and debuggers for nearly any language." },
      { question: "Do code editors support remote development?", answer: "Many leading editors let you connect to remote servers, containers, or WSL environments and edit files as if they were local." },
      { question: "Which editor is best for beginners?", answer: "Editors with strong default configurations, built-in terminals, and large community support tend to be the easiest for beginners to pick up." },
    ],
  },
  "email-marketing": {
    paragraphs: [
      "The best email marketing platforms combine drag-and-drop campaign builders with reliable deliverability and detailed analytics. Automation workflows help you nurture leads without manual follow-up.",
      "Look for built-in audience segmentation, A/B testing, and integrations with your CRM or e-commerce platform. Strong deliverability rates matter more than flashy templates.",
      "Pricing usually scales with your subscriber list size, so compare free-tier limits and per-contact costs before committing to a long-term plan.",
    ],
    faq: [
      { question: "What is email marketing automation?", answer: "Automation lets you trigger emails based on user behavior, like welcome sequences or abandoned cart reminders, without manually sending each one." },
      { question: "How is pricing usually structured?", answer: "Most platforms charge based on the number of subscribers or contacts on your list, with higher tiers unlocking more sends and features." },
      { question: "What is deliverability and why does it matter?", answer: "Deliverability measures how many of your emails actually reach the inbox instead of spam folders, directly affecting campaign performance." },
      { question: "Can I integrate email marketing with my e-commerce store?", answer: "Most leading platforms offer native integrations with popular e-commerce platforms to sync customer and order data automatically." },
      { question: "Do I need coding skills to design emails?", answer: "No — most platforms offer drag-and-drop builders, though some allow custom HTML for advanced users." },
    ],
  },
  "cloud-storage": {
    paragraphs: [
      "A good cloud storage service should offer reliable sync, generous free storage, and strong file-sharing controls. Cross-device access is essential for keeping files up to date everywhere.",
      "Look for end-to-end encryption options, version history, and collaboration features like shared folders and real-time editing. Backup-focused services may prioritize redundancy over collaboration.",
      "Pricing typically scales with storage capacity, so compare per-GB costs and check for family or team plans if you need to share storage across multiple users.",
    ],
    faq: [
      { question: "How much free storage do most services offer?", answer: "Free tiers typically range from a few gigabytes up to 15GB, depending on the provider and any bundled apps." },
      { question: "Is cloud storage the same as backup software?", answer: "Not always — cloud storage focuses on syncing and sharing files, while backup software prioritizes automated, versioned copies of your entire system." },
      { question: "How secure is my data in the cloud?", answer: "Reputable providers use encryption in transit and at rest, and some offer end-to-end encryption for extra privacy." },
      { question: "Can I share files with people who don't have an account?", answer: "Yes — most services let you generate shareable links with optional passwords and expiration dates." },
      { question: "What happens if I exceed my storage limit?", answer: "You'll typically need to upgrade to a paid plan or free up space, as most providers pause new uploads once you hit your limit." },
    ],
  },
  antivirus: {
    paragraphs: [
      "Strong antivirus software should combine real-time malware detection with low system impact. Independent lab test scores are one of the best ways to compare actual protection quality.",
      "Look for additional layers like ransomware protection, phishing detection, and a firewall. Many suites now bundle VPN access and password management as well.",
      "Free antivirus tools can cover basic protection, but paid plans typically add identity theft monitoring, parental controls, and priority support.",
    ],
    faq: [
      { question: "Is free antivirus software enough?", answer: "Free antivirus covers basic malware detection, but paid plans usually add ransomware protection, firewalls, and faster support." },
      { question: "Will antivirus software slow down my computer?", answer: "Modern antivirus tools are designed to run efficiently in the background, though some impact is unavoidable during full system scans." },
      { question: "What is real-time protection?", answer: "Real-time protection continuously scans files and processes as they run, blocking threats before they can execute." },
      { question: "Do I need antivirus software on a Mac?", answer: "Macs face fewer threats than Windows but are not immune, so antivirus software is still a reasonable precaution." },
      { question: "How often should I run a full system scan?", answer: "Most antivirus tools run automatic background scans, but a manual full scan every week or two is a good extra precaution." },
    ],
  },
  "ai-tools": {
    paragraphs: [
      "The best AI tools combine fast, accurate output with flexible integrations into your existing workflow. Look for tools that support the specific tasks you need, whether that's writing, coding, image generation, or research.",
      "Check usage limits carefully — many AI tools cap free-tier requests or context length, which can matter a lot for longer tasks. Data privacy policies are also worth reviewing before uploading sensitive material.",
      "Pricing models vary widely, from flat monthly subscriptions to usage-based API pricing, so match the billing structure to how heavily you expect to use the tool.",
    ],
    faq: [
      { question: "What's the difference between AI chatbots and AI assistants?", answer: "Chatbots are typically conversational interfaces, while AI assistants often integrate directly into apps and workflows to complete specific tasks." },
      { question: "Are AI tools safe to use with sensitive data?", answer: "It depends on the provider's data policy — many offer enterprise tiers with stricter data handling, so check before uploading sensitive information." },
      { question: "Do AI tools require a subscription?", answer: "Many offer free tiers with usage limits, while heavier or professional use typically requires a paid plan or API credits." },
      { question: "Can AI tools replace human work entirely?", answer: "Most AI tools work best as assistants that speed up tasks, rather than full replacements for human judgment and review." },
      { question: "How accurate are AI-generated outputs?", answer: "Accuracy varies by tool and task — always review AI-generated content for factual accuracy, especially for important decisions." },
    ],
  },
  "password-managers": {
    paragraphs: [
      "A reliable password manager should offer strong encryption, cross-device sync, and easy autofill across browsers and apps. Look for zero-knowledge architecture so even the provider can't access your stored data.",
      "Features like secure password sharing, breach monitoring, and two-factor authentication support add real security value beyond basic password storage.",
      "Free tiers are often limited to a single device, so compare family or team plans if you need to share access or manage multiple users.",
    ],
    faq: [
      { question: "What does zero-knowledge encryption mean?", answer: "It means your master password and stored data are encrypted locally, so the provider itself cannot access your unencrypted information." },
      { question: "Can I share passwords securely with family or coworkers?", answer: "Yes — most password managers offer secure sharing features that let you share login credentials without revealing the actual password." },
      { question: "What happens if I forget my master password?", answer: "Most providers cannot recover your master password due to zero-knowledge encryption, so it's critical to keep a backup recovery method." },
      { question: "Are password managers safe from hacking?", answer: "No system is completely immune, but reputable password managers use strong encryption and security audits to minimize risk significantly." },
      { question: "Do password managers work across all my devices?", answer: "Most leading password managers sync across desktop, mobile, and browser extensions so your passwords are available everywhere." },
    ],
  },
};

const getPriceLabel = (software: { pricing_data?: { price: number; period: string }[] | any; starting_price?: number | null }) => {
  const tiers = Array.isArray(software.pricing_data) ? software.pricing_data : [];
  const price = tiers[0];
  if (price) return price.price === 0 ? "Free" : `$${price.price}/${price.period}`;
  if (typeof software.starting_price === "number") return `$${software.starting_price}/mo`;
  return "—";
};

const hasFreeTier = (software: { pricing_data?: { price: number }[] | any; has_free_tier?: boolean | null }) => {
  const tiers = Array.isArray(software.pricing_data) ? software.pricing_data : [];
  if (tiers.some((tier: { price: number }) => tier.price === 0)) return "Yes";
  return software.has_free_tier ? "Yes" : "No";
};

const getTrustScore = (software: unknown) => {
  const trust = (software as { trust_score?: number }).trust_score;
  return typeof trust === "number" ? trust.toFixed(1) : "—";
};

const Category = ({ initialTools, initialCategories }: { initialTools?: Software[]; initialCategories?: Category[] }) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useCategories(initialCategories);
  const { data: software = [], isLoading } = useSoftwareByCategory(slug, initialTools);

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

  const commercialSoftware = useMemo(
    () => software.filter((s) => s.entity_type !== "open-source"),
    [software],
  );
  const openSourceSoftware = useMemo(
    () => software.filter((s) => s.entity_type === "open-source"),
    [software],
  );

  return (
    <div className="container py-16">
      <Seo
        title={`Best ${prettyName} Software 2026 — SoftwareOS`}
        description={`Compare the best ${prettyName} software. Shortcuts, pricing, reviews and AI-powered comparisons.`}
        canonical={`https://softwaros-nextjs.vercel.app/category/${slug}`}
        noindex={!isLoading && software.length === 0}
      />

      <nav className="text-xs font-mono text-muted-foreground mb-4 flex flex-wrap gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <Link href="/categories" className="hover:text-primary">Categories</Link>
        <span>›</span>
        <span className="text-white">{prettyName}</span>
      </nav>

      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Best {prettyName} Software 2026</h1>
        <p className="text-muted-foreground mb-6">
          {software.length} {software.length === 1 ? "tool" : "tools"} compared
        </p>
        <p className="text-muted-foreground max-w-3xl">
          {`Hand-picked ${prettyName} apps with shortcuts, pricing and AI comparisons.`}
        </p>
      </section>

      {isLoading ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </section>
      ) : software.length === 0 ? (
        <section className="text-center py-16 text-muted-foreground font-mono text-sm mb-12 border border-border/60 rounded-3xl">
          <p className="text-lg font-semibold mb-2">🔜 Coming Soon</p>
          <p>More {prettyName} tools are coming soon. Check back later!</p>
        </section>
      ) : (
        <>
          {commercialSoftware.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Commercial {prettyName} Software</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Paid and freemium {prettyName} tools, ranked by trust score.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {commercialSoftware.map((s) => (
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
                ))}
              </div>
            </section>
          )}

          {openSourceSoftware.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Open Source {prettyName} Software</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Free, self-hostable {prettyName} tools you can run and audit yourself.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {openSourceSoftware.map((s) => (
                  <Link key={s.id} href={`/software/${s.slug}`} className="glass glass-hover p-5 group border-emerald-900/40">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform">{s.logo ?? "▣"}</div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded">
                        Open Source
                      </span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                    <div className="mt-4 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition">
                      open ./{s.slug} →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

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
