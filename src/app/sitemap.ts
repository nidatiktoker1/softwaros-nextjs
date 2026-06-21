import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/shortcuts`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Only include categories that actually have tools (empty ones are noindex'd on-page)
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, category_slug, updated_at");

  const categoryCounts = new Map<string, number>();
  for (const t of tools ?? []) {
    categoryCounts.set(t.category_slug, (categoryCounts.get(t.category_slug) ?? 0) + 1);
  }

  const { data: categories } = await supabase.from("categories").select("slug");

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? [])
    .filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0)
    .map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const softwareRoutes: MetadataRoute.Sitemap = (tools ?? []).flatMap((t) => [
    {
      url: `${SITE_URL}/software/${t.slug}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/software/${t.slug}/pricing`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/software/${t.slug}/shortcuts`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/software/${t.slug}/reviews`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]);

  return [...staticRoutes, ...categoryRoutes, ...softwareRoutes];
}
