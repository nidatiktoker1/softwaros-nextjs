"use client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      description: "Perfect for getting started",
      features: [
        { text: "3 AI comparisons / day", included: true },
        { text: "All shortcuts & reviews", included: true },
        { text: "Browse 180+ tools", included: true },
        { text: "Basic filters", included: true },
        { text: "Unlimited comparisons", included: false },
        { text: "Priority support", included: false },
        { text: "Early feature access", included: false },
      ],
      cta: "Get Started",
      ctaVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "For power users & professionals",
      featured: true,
      features: [
        { text: "Unlimited comparisons", included: true },
        { text: "All shortcuts & reviews", included: true },
        { text: "Save & organize favorites", included: true },
        { text: "Advanced filters & sorting", included: true },
        { text: "Price drop alerts", included: true },
        { text: "No ads", included: true },
        { text: "Priority support", included: true },
      ],
      cta: "Upgrade to Pro",
      ctaVariant: "default" as const,
    },
    {
      name: "Teams",
      price: "$29",
      period: "/month",
      description: "For teams & enterprises",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "5 team member seats", included: true },
        { text: "Shared comparison decks", included: true },
        { text: "Team analytics & insights", included: true },
        { text: "Custom shortcuts library", included: true },
        { text: "Dedicated support", included: true },
        { text: "Early feature access", included: true },
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">flexible pricing, no hidden fees</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-2xl reveal">
            <span className="gradient-text">Plans for every</span>
            <br />
            <span className="gradient-text-orange">software developer</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl reveal">
            Start free. Upgrade anytime. Cancel anytime. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`glass glass-hover p-8 rounded-lg flex flex-col reveal ${
                plan.featured ? "border-2 border-primary/50 shadow-glow" : "border border-border/40"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.featured && (
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-mono">
                    <span>★</span>
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="mb-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="my-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </div>

              <Button
                className={`w-full mb-8 ${
                  plan.featured
                    ? "bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
                    : ""
                }`}
                variant={plan.ctaVariant}
              >
                {plan.cta}
              </Button>

              <div className="space-y-3 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <div key={`${plan.name}-${fIndex}`} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-border/40 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-20 border-t border-border">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I try Pro for free?",
                a: "Yes! Start with the Free plan and upgrade anytime. No commitment.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, cancel anytime with no penalties or hidden fees. Your access ends at the end of your billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and crypto payments through Lemon Squeezy.",
              },
              {
                q: "Do you offer team discounts?",
                a: "Yes! Contact us for custom team and enterprise pricing for 10+ members.",
              },
              {
                q: "Is there a free trial for Teams?",
                a: "Yes, get 14 days free to try Teams with your whole team.",
              },
              {
                q: "Can I switch plans later?",
                a: "Absolutely. Upgrade or downgrade your plan anytime, and we'll prorate your billing.",
              },
            ].map((item, i) => (
              <div key={i} className="glass glass-hover p-5 rounded-lg">
                <h3 className="font-bold mb-2 text-foreground">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 border-t border-border">
        <div className="glass glass-hover p-12 text-center rounded-lg">
          <h2 className="text-3xl font-bold gradient-text mb-3">Ready to upgrade?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers using SoftwareOS to master their tools, save time, and make better software decisions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-mono text-sm font-bold hover:shadow-glow transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-md border border-border/40 text-foreground hover:border-primary/40 font-mono text-sm font-bold transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
