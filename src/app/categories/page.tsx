"use client";
import Link from "next/link";
import { useCategories, useCategoryCounts } from "@/hooks/useSoftware";
import { Seo } from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: counts = {}, isLoading: countsLoading } = useCategoryCounts();
  const isLoading = categoriesLoading || countsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="All Software Categories — SoftwareOS"
        description="Browse every software category on SoftwareOS, from VPNs and design tools to project management and AI tools. Compare paid and open-source options side by side."
        canonical="https://softwaros-nextjs.vercel.app/categories"
      />

      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <nav className="text-xs font-mono text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Categories</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
            Browse Every Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            SoftwareOS organizes every tool we track into {categories.length || "27"} categories, each
            covering both commercial and open-source options. Pick a category below to compare tools,
            see real pricing, and read shortcuts for the apps you actually use.
          </p>
        </div>
      </section>

      <section className="container py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((c) => {
              const count = counts[c.slug] ?? 0;
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="glass glass-hover p-5 group reveal"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform">
                      {c.icon ?? "▣"}
                    </div>
                    {count === 0 ? (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5 rounded">
                        {count} {count === 1 ? "tool" : "tools"}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg group-hover:text-primary transition">{c.name}</h2>
                  <div className="mt-3 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition">
                    open ./{c.slug} →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
