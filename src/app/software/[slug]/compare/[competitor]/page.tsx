import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import CompareClient from "./CompareClient";

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
  { params }: { params: Promise<{ slug: string; competitor: string }> }
): Promise<Metadata> {
  const { slug, competitor } = await params;
  let a: any, b: any;
  try {
    [a, b] = await Promise.all([fetchTool(slug), fetchTool(competitor)]);
  } catch {
    a = undefined;
    b = undefined;
  }
  const nameA = a?.name ?? slug;
  const nameB = b?.name ?? competitor;
  const title = `${nameA} vs ${nameB} 2026 — Full Comparison | SoftwareOS`;
  const description = `${nameA} vs ${nameB} compared: features, pricing, shortcuts, trust scores and which one fits your workflow — side-by-side on SoftwareOS.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${slug}/compare/${competitor}` },
    openGraph: { title, description, url: `${SITE_URL}/software/${slug}/compare/${competitor}`, type: "website" },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string; competitor: string }>;
}) {
  const { slug, competitor } = await params;
  let initialA: any = undefined;
  let initialB: any = undefined;
  try {
    [initialA, initialB] = await Promise.all([fetchTool(slug), fetchTool(competitor)]);
  } catch {
    initialA = undefined;
    initialB = undefined;
  }
  return <CompareClient initialA={initialA} initialB={initialB} />;
}
