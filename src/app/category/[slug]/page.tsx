import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import CategoryClient from "./CategoryClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

const categoryDescriptions: Record<string, string> = {
  vpn: "Compare the best VPN services for privacy, streaming, and security. Side-by-side pricing, speed, and feature comparisons for both paid and open-source VPNs.",
  design: "Compare the best design tools for UI/UX, illustration, and prototyping. Find the right app with real pricing, shortcuts, and AI-powered comparisons.",
  productivity: "Find the best productivity apps to organize tasks, notes, and workflows. Compare features, pricing, and shortcuts across leading tools.",
  development: "Compare the best development tools, IDEs, and code editors. Real pricing, keyboard shortcuts, and feature comparisons for developers.",
  "ai-tools": "Compare the best AI tools for writing, coding, image generation, and research. Real pricing, use cases, and head-to-head comparisons.",
  "password-managers": "Compare the best password managers for security, sync, and sharing. Side-by-side pricing, features, and zero-knowledge encryption comparisons.",
  "code-editors": "Compare the best code editors and IDEs. Find the right editor with plugin ecosystems, language support, and pricing comparisons.",
  "email-marketing": "Compare the best email marketing platforms for automation, deliverability, and analytics. Real pricing and feature comparisons.",
  "cloud-storage": "Compare the best cloud storage services for sync, sharing, and backup. Pricing per GB, security, and collaboration feature comparisons.",
  antivirus: "Compare the best antivirus software for real-time protection, performance, and value. Side-by-side test scores and pricing.",
  "video-editing": "Compare the best video editing software for creators and professionals. Pricing, platform support, and feature comparisons.",
  "photo-editing": "Compare the best photo editing tools for retouching, compositing, and design. Real pricing and feature breakdowns.",
  crm: "Compare the best CRM software for sales, marketing, and customer support. Pricing, integration, and feature comparisons.",
  "project-management": "Compare the best project management tools for teams and solo users. Pricing, workflows, and collaboration feature comparisons.",
  communication: "Compare the best communication and collaboration tools for teams. Pricing, video, and messaging feature comparisons.",
  "note-taking": "Compare the best note-taking apps for personal and team knowledge management. Pricing, sync, and feature comparisons.",
  accounting: "Compare the best accounting software for invoicing, bookkeeping, and taxes. Pricing and feature comparisons.",
  ecommerce: "Compare the best e-commerce platforms for building and running online stores. Pricing, features, and integrations compared.",
  "website-builders": "Compare the best website builders for personal sites, portfolios, and businesses. Pricing, templates, and feature comparisons.",
  "seo-tools": "Compare the best SEO tools for keyword research, rank tracking, and site audits. Pricing and feature comparisons.",
  "social-media-management": "Compare the best social media management tools for scheduling, analytics, and engagement. Pricing and feature comparisons.",
  "hr-recruiting": "Compare the best HR and recruiting software for hiring, onboarding, and people management. Pricing and feature comparisons.",
  "customer-support": "Compare the best customer support and helpdesk software for ticketing and live chat. Pricing and feature comparisons.",
  "analytics-bi": "Compare the best analytics and business intelligence platforms for data visualization and reporting. Pricing and feature comparisons.",
  automation: "Compare the best no-code and automation tools for workflow automation and app building. Pricing and feature comparisons.",
  writing: "Compare the best writing and grammar tools for content creation and editing. Pricing and feature comparisons.",
  presentation: "Compare the best presentation tools for building slides and decks. Pricing, templates, and collaboration feature comparisons.",
};

function prettyName(slug: string): string {
  const names: Record<string, string> = {
    vpn: "VPN", crm: "CRM", "ai-tools": "AI Tools",
    "password-managers": "Password Managers", "code-editors": "Code Editors",
    "email-marketing": "Email Marketing", "cloud-storage": "Cloud Storage",
    "video-editing": "Video Editing", "photo-editing": "Photo Editing",
    "project-management": "Project Management", "note-taking": "Note-Taking",
    "website-builders": "Website Builders", "seo-tools": "SEO Tools",
    "social-media-management": "Social Media Management",
    "hr-recruiting": "HR & Recruiting", "customer-support": "Customer Support",
    "analytics-bi": "Analytics & BI", "presentation": "Presentation Tools",
    "automation": "No-Code & Automation", "writing": "Writing & Grammar",
    "accounting": "Accounting & Finance", "ecommerce": "E-commerce",
  };
  return names[slug] ?? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const name = prettyName(slug);
  const description = categoryDescriptions[slug]
    ?? `Compare the best ${name} software. Shortcuts, pricing, reviews and AI-powered comparisons on SoftwareOS.`;

  return {
    title: `Best ${name} Software 2026 — Compare Tools, Pricing & Shortcuts | SoftwareOS`,
    description,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: {
      title: `Best ${name} Software 2026 — SoftwareOS`,
      description,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${name} Software 2026 — SoftwareOS`,
      description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let initialTools: any[] | undefined;
  let initialCategories: any[] | undefined;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [toolsRes, catsRes] = await Promise.all([
      supabase
        .from("tools")
        .select("*")
        .eq("category_slug", slug)
        .order("trust_score", { ascending: false, nullsFirst: false }),
      supabase
        .from("categories")
        .select("id,slug,name,icon,sort_order")
        .order("sort_order", { ascending: true }),
    ]);
    if (!toolsRes.error && toolsRes.data) initialTools = toolsRes.data;
    if (!catsRes.error && catsRes.data) initialCategories = catsRes.data;
  } catch {
    // Server fetch unavailable (e.g. missing env at build time): the client
    // component falls back to its normal browser fetch.
    initialTools = undefined;
    initialCategories = undefined;
  }
  return <CategoryClient initialTools={initialTools} initialCategories={initialCategories} />;
}
