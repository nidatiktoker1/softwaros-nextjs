import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import SoftwareClient from "./SoftwareClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

async function getToolBySlug(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("tools")
    .select("name, description, category, category_slug, logo_url, starting_price, has_free_tier")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return { title: "Software — SoftwareOS" };
  }

  const priceStr = tool.has_free_tier
    ? "Free tier available"
    : tool.starting_price
    ? `From $${tool.starting_price}/mo`
    : "";

  const title = `${tool.name} Review 2026 — Shortcuts, Pricing & Comparisons | SoftwareOS`;
  const description = tool.description
    ? `${tool.description.slice(0, 140)}... ${priceStr ? `${priceStr}.` : ""} Compare ${tool.name} with alternatives on SoftwareOS.`
    : `${tool.name}: keyboard shortcuts, real pricing, user reviews, and AI-powered comparisons. ${priceStr}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/software/${slug}`,
      type: "website",
      images: tool.logo_url ? [{ url: tool.logo_url, width: 128, height: 128, alt: tool.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function SoftwarePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbSlug = slug === "vscode" ? "vs-code" : slug;
  let initialTool: any = undefined;
  let initialList: any[] | undefined;
  let initialShortcuts: any[] | undefined;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [toolRes, listRes, shortcutsRes] = await Promise.all([
      supabase.from("tools").select("*").eq("slug", dbSlug).maybeSingle(),
      supabase.from("tools").select("*").order("name"),
      supabase.from("shortcuts").select("*").eq("tool_slug", dbSlug).order("category"),
    ]);
    if (!toolRes.error && toolRes.data) initialTool = toolRes.data;
    if (!listRes.error && listRes.data) initialList = listRes.data;
    if (!shortcutsRes.error && shortcutsRes.data) initialShortcuts = shortcutsRes.data;
  } catch {
    // Server fetch unavailable: client falls back to its browser fetch.
    initialTool = undefined;
    initialList = undefined;
    initialShortcuts = undefined;
  }
  return (
    <SoftwareClient
      initialTool={initialTool}
      initialList={initialList}
      initialShortcuts={initialShortcuts}
    />
  );
}
