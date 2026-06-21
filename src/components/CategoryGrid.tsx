import { useMemo } from "react";
import { useCategories } from "@/hooks/useSoftware";
import { useSoftwareList } from "@/hooks/useSoftware";
import { Skeleton } from "@/components/ui/skeleton";

export const CategoryGrid = () => {
  const { data: cats, isLoading } = useCategories();
  const { data: software } = useSoftwareList();

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of software ?? []) {
     m.set(s.category_slug, (m.get(s.category_slug) ?? 0) + 1);
    }
    return m;
  }, [software]);

  return (
    <section id="categories" className="container py-20 border-t border-border">
      <div className="reveal mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-primary text-xs font-mono mb-2">$ ls ./categories</p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Browse by category</h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Every tool, sorted by what it does, with both commercial and open-source options compared side by side.
          </p>
        </div>
        <a href="/categories" className="text-sm font-mono text-primary hover:underline whitespace-nowrap">
          View all categories →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : (cats ?? []).map((c, i) => {
              const count = counts.get(c.slug) ?? 0;
              return (
                <a
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="glass glass-hover p-5 group reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {c.icon ?? "▦"}
                  </div>
                  <div className="font-bold group-hover:text-primary transition">{c.name}</div>
                  {c.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</div>
                  )}
                  <div className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {count} {count === 1 ? "tool" : "tools"}
                  </div>
                </a>
              );
            })}
      </div>
    </section>
  );
};
