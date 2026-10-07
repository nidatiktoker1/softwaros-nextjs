"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useSoftware } from "@/hooks/useSoftware";
import { useSoftwareSlug } from "@/hooks/useSoftwareSlug";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { SoftwareTabs } from "@/components/SoftwareTabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type Review = {
  id: string;
  rating: number;
  text: string;
  team_size: string | null;
  use_case: string | null;
  author_name: string | null;
  created_at: string;
};

const schemaForm = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().trim().min(5).max(5000),
  author_name: z.string().trim().max(100).optional().or(z.literal("")),
  team_size: z.string().trim().max(50).optional().or(z.literal("")),
  use_case: z.string().trim().max(200).optional().or(z.literal("")),
});

const Stars = ({ value, onChange }: { value: number; onChange?: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        className={`text-2xl transition ${n <= value ? "text-primary" : "text-muted-foreground"}`}
        aria-label={`${n} stars`}
      >
        ★
      </button>
    ))}
  </div>
);

const ReviewsPage = ({ initialTool, initialReviews }: { initialTool?: any; initialReviews?: any[] }) => {
  const { slug: software } = useSoftwareSlug();
  const { data: sw } = useSoftware(software, initialTool);
  const [reviews, setReviews] = useState<Review[]>((initialReviews ?? []) as Review[]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sw?.id) return;
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("software_id", sw.id)
        .order("created_at", { ascending: false });
      setReviews((data ?? []) as Review[]);
    })();
  }, [sw?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sw?.id) return;
    const parsed = schemaForm.safeParse({ rating, text, author_name: author, team_size: teamSize, use_case: useCase });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        software_id: sw.id,
        rating,
        text: parsed.data.text,
        author_name: author || null,
        team_size: teamSize || null,
        use_case: useCase || null,
      })
      .select()
      .single();
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    setReviews((prev) => [data as Review, ...prev]);
    setText(""); setAuthor(""); setTeamSize(""); setUseCase(""); setRating(5);
    toast({ title: "Review posted", description: "Thanks for the signal." });
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const seoTitle = `${sw?.name ?? software} Reviews — Real User Verdicts | SoftwareOS`;
  const seoDesc = `Read and submit ${sw?.name ?? software} reviews. ${reviews.length} ratings, average ${avg.toFixed(1)}/5.`;

  const schema = sw && reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sw.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
    },
  } : undefined;

  return (
    <div className="container py-8 max-w-4xl">
      <Seo title={seoTitle} description={seoDesc} schema={schema} />
      <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-primary">← cd ..</Link>

      <header className="mt-2 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>{sw?.logo}</span> {sw?.name} Reviews
        </h1>
        {reviews.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-primary">{avg.toFixed(1)}/5</span> from {reviews.length} reviews
          </p>
        )}
      </header>

      <SoftwareTabs />

      <form onSubmit={submit} className="terminal-border p-6 mb-8 space-y-4">
        <h2 className="font-mono text-sm text-muted-foreground">$ review --new</h2>
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-2">rating</label>
          <Stars value={rating} onChange={setRating} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input placeholder="your name (optional)" value={author} onChange={(e) => setAuthor(e.target.value)} className="font-mono text-sm" maxLength={100} />
          <Input placeholder="team size (e.g. 1-10)" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="font-mono text-sm" maxLength={50} />
          <Input placeholder="use case (e.g. UI design)" value={useCase} onChange={(e) => setUseCase(e.target.value)} className="font-mono text-sm" maxLength={200} />
        </div>
        <Textarea
          placeholder="What works, what doesn't?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm min-h-[100px]"
          maxLength={5000}
        />
        <button
          disabled={submitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "submitting..." : "submit review"}
        </button>
      </form>

      <div className="space-y-3">
        {reviews.map((r) => (
          <article key={r.id} className="terminal-border p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></span>
                <span className="text-sm">{r.author_name || "anonymous"}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{new Date(r.created_at).toISOString().slice(0, 10)}</span>
            </div>
            {(r.team_size || r.use_case) && (
              <div className="text-[10px] font-mono text-muted-foreground mb-2">
                {[r.team_size, r.use_case].filter(Boolean).join(" • ")}
              </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.text}</p>
          </article>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground font-mono text-sm py-12">
            no reviews yet. be the first.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
