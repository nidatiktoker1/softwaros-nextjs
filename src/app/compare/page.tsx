"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSoftwareList, useCategories } from "@/hooks/useSoftware";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function ComparePage() {
  const revealRef = useReveal<HTMLDivElement>();
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const { data: software, isLoading } = useSoftwareList();
  const { data: categories, isLoading: catLoading } = useCategories();

  const filteredCategories = useMemo(() => {
    return (categories ?? []).filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  const toolsInCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return (software ?? []).filter((s) => s.category_slug === selectedCategory);
  }, [software, selectedCategory]);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedA(null);
    setSelectedB(null);
  };

  const handleCompare = () => {
    if (selectedA && selectedB) {
      window.location.href = `/software/${selectedA}/compare/${selectedB}`;
    }
  };

  const canCompare = selectedA && selectedB && selectedA !== selectedB;
  const selectedCategoryName = (categories ?? []).find((c) => c.slug === selectedCategory)?.name;

  return (
    <div ref={revealRef} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container py-20 md:py-28 border-b border-border">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono mb-6 reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">ai-powered comparisons</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-2xl reveal">
            <span className="gradient-text">Compare any</span>
            <br />
            <span className="gradient-text-orange">two tools</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl reveal">
            Side-by-side comparison with AI analysis. See which tool wins for your use case.
          </p>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass glass-hover p-8 rounded-lg mb-10">
            {/* Step 1: Category selector */}
            <label className="block text-sm font-medium mb-3">
              Step 1 — Pick a category
            </label>
            <Input
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="vpn, design, productivity..."
              className="mb-4"
            />

            <div className="flex flex-wrap gap-2 mb-8">
              {catLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-24" />)
              ) : filteredCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories found</p>
              ) : (
                filteredCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-mono border transition flex items-center gap-2 ${
                      selectedCategory === cat.slug
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-transparent border-border/40 hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))
              )}
            </div>

            {/* Step 2: Tool A / Tool B - only shown after category selected */}
            {selectedCategory && (
              <>
                <label className="block text-sm font-medium mb-3">
                  Step 2 — Pick two {selectedCategoryName} tools
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tool A */}
                  <div>
                    <h3 className="font-bold mb-4">Tool A</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)
                      ) : toolsInCategory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tools in this category yet</p>
                      ) : (
                        toolsInCategory.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => setSelectedA(tool.slug)}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${
                              selectedA === tool.slug
                                ? "bg-primary/20 border-primary/50"
                                : "bg-transparent border-border/40 hover:border-primary/40"
                            }`}
                          >
                            <span className="text-2xl">{tool.logo ?? "▣"}</span>
                            <div className="min-w-0">
                              <div className="font-medium text-sm">{tool.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{tool.category}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Tool B */}
                  <div>
                    <h3 className="font-bold mb-4">Tool B</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)
                      ) : toolsInCategory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tools in this category yet</p>
                      ) : (
                        toolsInCategory
                          .filter((tool) => tool.slug !== selectedA)
                          .map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => setSelectedB(tool.slug)}
                              className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${
                                selectedB === tool.slug
                                  ? "bg-primary/20 border-primary/50"
                                  : "bg-transparent border-border/40 hover:border-primary/40"
                              }`}
                            >
                              <span className="text-2xl">{tool.logo ?? "▣"}</span>
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{tool.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{tool.category}</div>
                              </div>
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full mt-8 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
            >
              Compare with AI Council <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Pick a category",
                desc: "Choose a category, then pick two tools from it to compare.",
              },
              {
                title: "AI debate",
                desc: "4 AIs analyze features, pricing, learning curve, and more.",
              },
              {
                title: "Get verdict",
                desc: "See which tool wins and why, based on your use case.",
              },
            ].map((step, i) => (
              <div key={i} className="glass glass-hover p-4 text-center">
                <div className="text-2xl font-bold gradient-text mb-2">{i + 1}</div>
                <h4 className="font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Comparisons */}
      <section className="container py-20 border-t border-border">
        <h2 className="text-3xl font-bold gradient-text mb-10">Popular Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { a: "figma", b: "canva", label: "Figma vs Canva" },
            { a: "nordvpn", b: "expressvpn", label: "NordVPN vs ExpressVPN" },
            { a: "chatgpt", b: "claude", label: "ChatGPT vs Claude" },
          ].map((comp, i) => (
            <Link
              key={i}
              href={`/software/${comp.a}/compare/${comp.b}`}
              className="glass glass-hover p-5 rounded-lg text-center hover:border-primary/50 transition"
            >
              <div className="font-bold text-lg">{comp.label}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Click to see AI verdict
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
