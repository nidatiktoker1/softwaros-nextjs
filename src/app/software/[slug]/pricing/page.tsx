"use client";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useSoftware } from "@/hooks/useSoftware";
import { useSoftwareSlug } from "@/hooks/useSoftwareSlug";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { SoftwareTabs } from "@/components/SoftwareTabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().email().max(255);

const PricingPage = () => {
  const { slug: software } = useSoftwareSlug();
  const { data: sw } = useSoftware(software);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cheapest = (Array.isArray(sw?.pricing) ? sw.pricing : [])
  .filter((t: any) => t.price > 0)
    .sort((a, b) => a.price - b.price)[0]?.price;

  const onAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sw?.id) return;
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("price_alerts").insert({
      email: parsed.data,
      software_id: sw.id,
      current_price: cheapest ?? null,
    });
    setSubmitting(false);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setEmail("");
    toast({ title: "Subscribed", description: `We'll email you when ${sw.name} pricing drops.` });
  };

  const seoTitle = `${sw?.name ?? software} Pricing 2026 — Plans, Alerts & Best Deal | SoftwareOS`;
  const seoDesc = `Current ${sw?.name ?? software} pricing tiers, monthly cost, and free alternatives. Get notified when the price drops.`;

  const schema = sw ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sw.name,
    offers: (Array.isArray(sw.pricing) ? sw.pricing : []).map((t) => ({
      "@type": "Offer",
      name: t.tier,
      price: t.price,
      priceCurrency: "USD",
      url: sw.affiliate_link,
    })),
  } : undefined;

  return (
    <div className="container py-8 max-w-4xl">
      <Seo title={seoTitle} description={seoDesc} schema={schema} />
      <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-primary">← cd ..</Link>

      <header className="mt-2 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>{sw?.logo}</span> {sw?.name} Pricing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Up-to-date plans for {sw?.name}.
        </p>
      </header>

      <SoftwareTabs />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {(Array.isArray(sw?.pricing) ? sw.pricing : []).map((t: any) => (
          <div key={t.tier} className="terminal-border p-6">
            <div className="font-mono text-xs uppercase text-muted-foreground">{t.tier}</div>
            <div className="mt-3">
              <span className="text-4xl font-bold">${t.price}</span>
              <span className="text-sm text-muted-foreground">/{t.period}</span>
            </div>
            {sw.affiliate_link && (
              <a
                href={sw.affiliate_link}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-5 block text-center w-full py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:opacity-90 transition"
              >
                buy {sw.name} →
              </a>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onAlert} className="terminal-border p-6">
        <h2 className="font-mono text-sm text-muted-foreground mb-2">$ price-alert --subscribe</h2>
        <p className="text-sm mb-4">
          Get an email the moment {sw?.name} pricing changes. No spam, unsubscribe any time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-mono text-sm flex-1"
            maxLength={255}
            required
          />
          <button
            disabled={submitting}
            className="px-5 py-2 bg-primary text-primary-foreground rounded font-mono text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "subscribing..." : "notify me"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PricingPage;
