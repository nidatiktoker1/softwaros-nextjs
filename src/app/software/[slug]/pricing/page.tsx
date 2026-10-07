import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import PricingClient from "./PricingClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

export const dynamic = "force-dynamic";

async function fetchTool(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.from("tools").select("*").eq("slug", slug).maybeSingle();
  return !error && data ? data : undefined;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  let tool: any;
  try {
    tool = await fetchTool(slug);
  } catch {
    tool = undefined;
  }
  const name = tool?.name ?? slug;
  const title = `${name} Pricing 2026 — Plans, Costs & Free Tier | SoftwareOS`;
  const description = `${name} pricing in 2026: plans, monthly and yearly costs, free tier availability and what each plan includes — compared on SoftwareOS.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${slug}/pricing` },
    openGraph: { title, description, url: `${SITE_URL}/software/${slug}/pricing`, type: "website" },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let initialTool: any = undefined;
  try {
    initialTool = await fetchTool(slug);
  } catch {
    initialTool = undefined;
  }
  return <PricingClient initialTool={initialTool} />;
}
