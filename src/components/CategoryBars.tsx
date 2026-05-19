import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCategories, useSoftwareList } from "@/hooks/useSoftware";

/**
 * Dual sticky nav:
 *  - Top: categories from the categories table (with icons)
 *  - Bottom: top 5 software for the active category (or top 5 overall)
 */
export const CategoryBars = () => {
  const { data: software } = useSoftwareList();
  const { data: categories } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCat = useMemo(() => {
    return searchParams.get("cat");
  }, [searchParams]);

  const top5 = useMemo(() => {
    const list = (software ?? []).filter((s) => !activeCat || activeCat === "all" || s.category === activeCat);
    return [...list]
      .sort((a, b) => {
        const ta = (a as unknown as { trust_score?: number }).trust_score ?? 0;
        const tb = (b as unknown as { trust_score?: number }).trust_score ?? 0;
        if (tb !== ta) return tb - ta;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5);
  }, [software, activeCat]);

  const activeSoftwareSlug = useMemo(() => {
    const m = pathname.match(/^\/(?: software\/)?([^/]+)/);
    if (!m) return null;
    return (software ?? []).find((s) => s.slug === m[1])?.slug ?? null;
  }, [pathname, software]);

  if (!software || software.length === 0) return null;

  return (
    <div className="sticky top-14 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      {/* Categories row */}
      <div className="border-b border-border/60">
        <div className="container flex items-center gap-1 overflow-x-auto h-10 text-xs font-mono scrollbar-hide">
          <span className="text-muted-foreground/60 mr-2 shrink-0">$ categories:</span>
          <a
            href="/#apps"
            className={`px-3 py-1 rounded-full border shrink-0 transition ${
              !activeCat || activeCat === "all"
                ? "bg-primary/15 text-primary border-primary/40"
                : "border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50"
            }`}
          >
            all
          </a>
          {(categories ?? []).map((c) => {
            const isActive = activeCat === c.name;
            return (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={`px-3 py-1 rounded-full border shrink-0 inline-flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50"
                }`}
              >
                {c.icon && <span>{c.icon}</span>}
                <span>{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Top-5 software row */}
      <div className="container flex items-center gap-1 overflow-x-auto h-10 text-xs font-mono scrollbar-hide">
        <span className="text-muted-foreground/60 mr-2 shrink-0">
          $ top5{activeCat && activeCat !== "all" ? `:${activeCat.toLowerCase()}` : ""}:
        </span>
        {top5.map((s) => {
          const isActive = activeSoftwareSlug === s.slug;
          return (
            <Link
              key={s.id}
              href={`/software/${s.slug}`}
              className={`px-3 py-1 rounded shrink-0 inline-flex items-center gap-1.5 transition ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              <span>{s.logo ?? "▣"}</span>
              <span>{s.name}</span>
            </Link>
          );
        })}
        {top5.length === 0 && (
          <span className="text-muted-foreground/60 px-2">no apps in this category yet</span>
        )}
      </div>
    </div>
  );
};
