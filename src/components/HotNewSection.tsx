import Link from "next/link";
import { useNewArrivals, useTrending } from "@/hooks/useSoftware";
import type { Software } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type Sw = Software & { trust_score?: number | null };

const HotCard = ({ s }: { s: Sw }) => (
  <div className="glass glass-hover p-5 flex flex-col group reveal">
    <div className="flex items-start justify-between mb-3 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={s.logo_url ?? `https://www.google.com/s2/favicons?domain=${s.slug}.com&sz=128`}
          alt={s.name}
          className="w-8 h-8 rounded object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display='none' }}
        />
        <div className="min-w-0">
          <div className="font-bold text-base truncate group-hover:text-primary transition">
            {s.name}
          </div>
          <span className="inline-block mt-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded">
            {s.category}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-lg font-bold gradient-text-orange leading-none tabular-nums">
          {(s.trust_score ?? 0).toFixed(1)}
          <span className="text-xs text-muted-foreground font-normal">/10</span>
        </div>
        <div className="text-[9px] uppercase font-mono text-muted-foreground mt-0.5">trust</div>
      </div>
    </div>
    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
      {s.description ?? "No tagline yet."}
    </p>
    <Link
      href={`/software/${s.slug}`}
      className="mt-4 inline-flex items-center justify-center h-9 px-4 rounded bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs font-mono font-bold hover:shadow-glow transition"
    >
      view →
    </Link>
  </div>
);

const NewCard = ({ s }: { s: Sw }) => (
  <Link
    href={`/software/${s.slug}`}
    className="glass glass-hover p-4 group flex items-center gap-3 reveal"
  >
    <img
      src={s.logo_url ?? `https://www.google.com/s2/favicons?domain=${s.slug}.com&sz=128`}
      alt={s.name}
      className="w-8 h-8 rounded object-contain"
      onError={(e) => { (e.target as HTMLImageElement).style.display='none' }}
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <div className="font-bold text-sm group-hover:text-primary transition truncate">
          {s.name}
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider text-primary border border-primary/40 px-1.5 py-0.5 rounded shrink-0">
          new
        </span>
      </div>
      <div className="text-[11px] text-muted-foreground font-mono truncate">{s.category}</div>
    </div>
  </Link>
);

export const HotNewSection = () => {
  const { data: hot, isLoading: hotLoading } = useTrending(6);
  const { data: fresh, isLoading: freshLoading } = useNewArrivals(4);

  return (
    <section className="container py-20 border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="reveal mb-5">
            <p className="text-primary text-xs font-mono mb-2">$ trending --week</p>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text-orange">
              🔥 Hot Right Now
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              The 6 apps everyone is comparing this week.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)
              : (hot ?? []).map((s) => <HotCard key={s.id} s={s as Sw} />)}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="reveal mb-5">
            <p className="text-primary text-xs font-mono mb-2">$ just-launched</p>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">✨ New Arrivals</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Fresh entries in the SoftwareOS index.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {freshLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)
              : (fresh ?? []).map((s) => <NewCard key={s.id} s={s as Sw} />)}
          </div>
          <Link
            href="/?sort=newest#apps"
            className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary-glow transition"
          >
            see all new arrivals →
          </Link>
        </div>
      </div>
    </section>
  );
};
