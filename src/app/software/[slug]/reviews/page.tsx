import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ReviewsClient from "./ReviewsClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

export const dynamic = "force-dynamic";

async function fetchToolAndReviews(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: tool, error } = await supabase.from("tools").select("*").eq("slug", slug).maybeSingle();
  if (error || !tool) return { tool: undefined, reviews: undefined };
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("software_id", (tool as any).id)
    .order("created_at", { ascending: false });
  return { tool, reviews: reviews ?? undefined };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  let tool: any;
  try {
    const r = await fetchToolAndReviews(slug);
    tool = r.tool;
  } catch {
    tool = undefined;
  }
  const name = tool?.name ?? slug;
  const title = `${name} Reviews 2026 — User Ratings & Feedback | SoftwareOS`;
  const description = `Real user reviews of ${name}: ratings, pros and cons, team experiences and use cases — read and share reviews on SoftwareOS.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${slug}/reviews` },
    openGraph: { title, description, url: `${SITE_URL}/software/${slug}/reviews`, type: "website" },
  };
}

export default async function ReviewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let initialTool: any = undefined;
  let initialReviews: any[] | undefined;
  try {
    const r = await fetchToolAndReviews(slug);
    initialTool = r.tool;
    initialReviews = r.reviews;
  } catch {
    initialTool = undefined;
    initialReviews = undefined;
  }
  return <ReviewsClient initialTool={initialTool} initialReviews={initialReviews} />;
}
