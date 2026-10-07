"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSoftware } from "@/hooks/useSoftware";
import { useSoftwareSlug } from "@/hooks/useSoftwareSlug";
import { getPersonaName } from "@/lib/ai-personas";
import { Seo } from "@/components/Seo";
import { SoftwareTabs } from "@/components/SoftwareTabs";
import { TypingAnimation } from "@/components/TypingAnimation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";

interface AIVerdict {
  engine: string;
  label: string;
  color: string;
  verdict: string | null;
  winner: string | null;
  error: string | null;
}

interface AllVerdicts {
  groq: AIVerdict;
  groqDataAnalyst: AIVerdict;
  mistral: AIVerdict;
  openrouter: AIVerdict;
}

const AI_ENGINES = {
  groq: {
    label: `⚡  ${getPersonaName("groq")} — Speed Expert`,
    color: "from-orange-500/20 to-red-500/10",
    borderColor: "border-orange-500/30",
  },
  groqDataAnalyst: {
    label: `📊  ${getPersonaName("groq")} Analytics — Data Specialist`,
    color: "from-blue-500/20 to-cyan-500/10",
    borderColor: "border-blue-500/30",
  },
  mistral: {
    label: `🌟  ${getPersonaName("mistral")} — European Perspective`,
    color: "from-violet-500/20 to-purple-500/10",
    borderColor: "border-violet-500/30",
  },
  openrouter: {
    label: `🧠  ${getPersonaName("cohere")} — Analysis Expert`,
    color: "from-emerald-500/20 to-green-500/10",
    borderColor: "border-emerald-500/30",
  },
};

// Feature comparison matrix: [software1, software2]
const featureMatrix: Record<string, [boolean, boolean]> = {
  "Price": [true, true],
  "Free plan": [true, false],
  "Mobile app": [true, true],
  "Offline mode": [false, true],
  "API access": [true, true],
  "24/7 Support": [true, true],
};

const ComparePage = ({ initialA, initialB }: { initialA?: any; initialB?: any }) => {
  const { competitor: competitorParam } = useParams();
  const { slug: software, basePath } = useSoftwareSlug();
  const competitor = Array.isArray(competitorParam) ? competitorParam[0] : competitorParam;
  const a = useSoftware(software, initialA);
  const b = useSoftware(competitor, initialB);
  
  const [verdicts, setVerdicts] = useState<AllVerdicts | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Parse winner from verdict text
  const determineWinner = (verdict: string, nameA: string, nameB: string) => {
    const text = verdict.toLowerCase();
    if (text.includes(nameA.toLowerCase())) return nameA;
    if (text.includes(nameB.toLowerCase())) return nameB;
    return nameA; // default
  };

  // Helper function to add timeout to fetch
  const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
      ),
    ]);
  };

  // Get the appropriate API endpoint (use direct external APIs)
  const getApiEndpoint = (type: "groq" | "gemini" | "openrouter"): string => {
    if (type === "groq") return "https://api.groq.com/openai/v1/chat/completions";
    if (type === "openrouter") return "https://openrouter.ai/api/v1/chat/completions";
    return "";
  };

  // Call Groq API
  const callGroq = async (prompt: string, nameA: string, nameB: string): Promise<AIVerdict> => {
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '';
      if (!text) throw new Error('No verdict text in response');
      const verdict = text;
      const winner = verdict ? determineWinner(verdict, nameA as string, nameB as string) : null;
      
      return {
        engine: "groq",
        label: AI_ENGINES.groq.label,
        color: AI_ENGINES.groq.color,
        verdict,
        winner,
        error: null,
      };
    } catch (e: any) {
      console.error("Groq API error:", e);
      return {
        engine: "groq",
        label: AI_ENGINES.groq.label,
        color: AI_ENGINES.groq.color,
        verdict: null,
        winner: null,
        error: e.message || "Failed to fetch",
      };
    }
  };

  // Call Groq Data Analyst API
  const callGroqDataAnalyst = async (softwareA: string, softwareB: string, nameA: string, nameB: string): Promise<AIVerdict> => {
    try {
      const dataAnalystPrompt = `From a data and value perspective, compare ${nameA} vs ${nameB} in exactly 3 sentences. Who gets better value? End with a clear recommendation.`;
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: dataAnalystPrompt }],
          max_tokens: 200
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '';
      if (!text) throw new Error('No verdict text in response');
      const verdict = text;
      const winner = verdict ? determineWinner(verdict, nameA as string, nameB as string) : null;

      return {
        engine: "groqDataAnalyst",
        label: AI_ENGINES.groqDataAnalyst.label,
        color: AI_ENGINES.groqDataAnalyst.color,
        verdict,
        winner,
        error: null,
      };
    } catch (e: any) {
      console.error("Groq Data Analyst API error:", e);
      return {
        engine: "groqDataAnalyst",
        label: AI_ENGINES.groqDataAnalyst.label,
        color: AI_ENGINES.groqDataAnalyst.color,
        verdict: null,
        winner: null,
        error: e.message || "Failed to fetch",
      };
    }
  };

  // Call Mistral API
  const callMistral = async (prompt: string, nameA: string, nameB: string): Promise<AIVerdict> => {
    try {
      const response = (await fetchWithTimeout(
        "/api/mistral",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
          }),
        },
        10000
      )) as Response;

      if (!response.ok) throw new Error(`Mistral API error: ${response.statusText}`);
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '';
      if (!text) throw new Error('No verdict text in response');
      const verdict = String(text).trim();
      const winner = verdict ? determineWinner(verdict, nameA as string, nameB as string) : null;

      return {
        engine: "mistral",
        label: AI_ENGINES.mistral.label,
        color: AI_ENGINES.mistral.color,
        verdict,
        winner,
        error: null,
      };
    } catch (e: any) {
      console.error("Mistral API error:", e);
      return {
        engine: "mistral",
        label: AI_ENGINES.mistral.label,
        color: AI_ENGINES.mistral.color,
        verdict: null,
        winner: null,
        error: e.message || "Failed to fetch",
      };
    }
  };

  // Call OpenRouter API
  const callOpenRouter = async (prompt: string, nameA: string, nameB: string): Promise<AIVerdict> => {
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      // Handle both OpenRouter and standard OpenAI response formats
      let text = '';
      if (data?.choices?.[0]?.message?.content) {
        text = data.choices[0].message.content;
      } else if (data?.choices?.[0]?.text) {
        text = data.choices[0].text;
      } else if (typeof data?.result === 'string') {
        text = data.result;
      }
      
      if (!text) {
        console.error('OpenRouter response structure:', JSON.stringify(data).substring(0, 200));
        throw new Error('No verdict text in response');
      }
      
      const verdict = text;
      const winner = verdict ? determineWinner(verdict, nameA as string, nameB as string) : null;

      return {
        engine: "openrouter",
        label: AI_ENGINES.openrouter.label,
        color: AI_ENGINES.openrouter.color,
        verdict,
        winner,
        error: null,
      };
    } catch (e: any) {
      console.error("OpenRouter API error:", e);
      return {
        engine: "openrouter",
        label: AI_ENGINES.openrouter.label,
        color: AI_ENGINES.openrouter.color,
        verdict: null,
        winner: null,
        error: e.message || "Failed to fetch",
      };
    }
  };

  useEffect(() => {
   if (!software || !competitor) return undefined;
    
    let cancel = false;
    
    const fetchAllVerdicts = async () => {
      setLoading(true);
      setErr(null);
      
      // Create a consistent cache key
      const softwareKey = software < competitor ? software : competitor;
      const competitorKey = software < competitor ? competitor : software;
      const cacheKey = `compare_${softwareKey}_${competitorKey}`;
      
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        if (!cancel) {
          try {
            const data = JSON.parse(cached);
            setVerdicts(data);
            setLoading(false);
          } catch (e) {
            console.error("Failed to parse cached verdicts:", e);
            localStorage.removeItem(cacheKey);
          }
        }
        return;
      }
      
      try {
        const nameA = a.data?.name || software;
        const nameB = b.data?.name || competitor;
        const prompt = `Compare ${nameA} vs ${nameB} in exactly 3 sentences. Who should choose ${nameA}? Who should choose ${nameB}? Give a clear final recommendation.`;
        
        // Rate limiting wrapper for each engine
        const callWithRateLimit = async (engine: string, callFunc: (prompt: string, nameA: string, nameB: string) => Promise<AIVerdict>) => {
          const rateLimitKey = `ratelimit_${engine}_${softwareKey}_${competitorKey}`;
          const verdictCacheKey = `verdict_${engine}_${softwareKey}_${competitorKey}`;
          const lastCallTime = localStorage.getItem(rateLimitKey);
          const oneMinute = 60 * 1000;
          
          if (lastCallTime && Date.now() - parseInt(lastCallTime) < oneMinute) {
            // Use cached result from localStorage instead of calling API
            const cachedResult = localStorage.getItem(verdictCacheKey);
            if (cachedResult) {
              console.log(`[${engine}] Using cached result due to rate limit`);
              return JSON.parse(cachedResult);
            }
          }
          
          // Make API call
         const result = await callFunc(prompt, nameA as string, nameB as string);
          
          // Save to cache and update rate limit timestamp
          localStorage.setItem(verdictCacheKey, JSON.stringify(result));
          localStorage.setItem(rateLimitKey, Date.now().toString());
          
          return result;
        };
        
        // Call all 4 APIs in parallel using Promise.all
        // All promises resolve (none reject) because each API call has its own try-catch
        const [groqResult, groqDataAnalystResult, mistralResult, openrouterResult] = await Promise.all([
          callWithRateLimit('groq', callGroq),
          callWithRateLimit('groqDataAnalyst', (prompt: string, nameA: string, nameB: string) => {
            const aName = Array.isArray(nameA) ? nameA[0] : nameA;
            const bName = Array.isArray(nameB) ? nameB[0] : nameB;
            return callGroqDataAnalyst(software, competitor, aName, bName);
          }),
          callWithRateLimit('mistral', callMistral),
          callWithRateLimit('openrouter', callOpenRouter),
        ]);
        
        const result: AllVerdicts = {
          groq: groqResult,
          groqDataAnalyst: groqDataAnalystResult,
          mistral: mistralResult,
          openrouter: openrouterResult,
        };
        
        if (!cancel) {
          // Cache all results including errors - never call APIs twice for same pair
          localStorage.setItem(cacheKey, JSON.stringify(result));
          setVerdicts(result);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancel) {
          setErr(e?.message || "Failed to fetch comparisons");
          setLoading(false);
        }
      }
    };
    
    fetchAllVerdicts();
    return () => { cancel = true; };
  }, [software, competitor, a.data?.name, b.data?.name]);

  const aName = a.data?.name ?? software;
  const bName = b.data?.name ?? competitor;
  const aPrice = "Contact";
  const bPrice = "Contact";
  const aTrustScore = (a.data?.trust_score?.toString() ?? "—");
  const bTrustScore = (b.data?.trust_score?.toString() ?? "—");
  
  const title = `${aName} vs ${bName} | 4-AI Council Verdict | SoftwareOS`;
  const description = `AI-powered comparison of ${aName} and ${bName} analyzed by Groq (2x), Mistral, and OpenRouter.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${aName} vs ${bName}`,
    description,
  };

  // Calculate consensus
  const verdictsList = verdicts ? [verdicts.groq, verdicts.groqDataAnalyst, verdicts.mistral, verdicts.openrouter] : [];
  const successfulVerdicts = verdictsList.filter(v => v.verdict && !v.error);
  const aVotes = successfulVerdicts.filter(v => v.winner === aName).length;
  const bVotes = successfulVerdicts.filter(v => v.winner === bName).length;
  const consensusWinner = aVotes > bVotes ? aName : bVotes > aVotes ? bName : null;

  return (
    <div className="container py-12 max-w-6xl">
      <Seo title={title} description={description} schema={schema} />

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span>{aName}</span>
          <span className="text-muted-foreground mx-4">vs</span>
          <span className="text-primary">{bName}</span>
        </h1>
        <p className="text-muted-foreground text-lg">Analyzed by 4 AI engines in parallel</p>
      </header>

      <SoftwareTabs />

      {err && (
        <div className="mb-8 p-4 border border-destructive bg-destructive/10 rounded-lg text-sm text-destructive">
          {err}
        </div>
      )}

      {/* Quick Facts Table */}
      <div className="mb-12 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Quick Facts</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">{aName}</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">{bName}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-muted-foreground">Price</td>
              <td className="py-3 px-4 text-center font-mono text-sm">{aPrice}</td>
              <td className="py-3 px-4 text-center font-mono text-sm">{bPrice}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-muted-foreground">Trust Score</td>
              <td className="py-3 px-4 text-center font-mono text-sm">{aTrustScore}</td>
              <td className="py-3 px-4 text-center font-mono text-sm">{bTrustScore}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4 AI Verdicts Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">🤖 4-AI Council Verdicts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verdictsList.map((v) => {
            const engineConfig = AI_ENGINES[v.engine as keyof typeof AI_ENGINES];
            const borderColor = engineConfig?.borderColor || "border-border";
            const label = engineConfig?.label || v.engine;
            const color = engineConfig?.color || "from-gray-500/20 to-gray-500/10";
            return (
            <div 
              key={v.engine}
              className={`p-6 border rounded-lg bg-gradient-to-br ${color} ${borderColor}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base">{label}</h3>
                </div>
                {v.error && (
                  <span className="text-xs font-mono font-bold text-white bg-destructive px-2 py-1 rounded">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Verdict or Error */}
              <div className="min-h-[7rem] mb-4">
                {v.error ? (
                  <p className="text-sm text-muted-foreground italic">⚠️ {v.error}</p>
                ) : v.verdict ? (
                  <p className="text-sm leading-relaxed text-foreground">
                    <TypingAnimation text={v.verdict} speed={20} />
                  </p>
                ) : loading ? (
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>

              {/* Recommendation Badge */}
              {v.winner && !v.error && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/20 border border-primary/50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Recommends: {v.winner}</span>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* AI Consensus */}
      {verdicts && successfulVerdicts.length > 0 && (
        <div className="mb-12 p-6 border border-primary/40 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <h3 className="font-bold text-lg mb-3">🏆 AI Consensus</h3>
          {successfulVerdicts.length < verdictsList.length && (
            <p className="text-xs text-muted-foreground mb-4">
              ({successfulVerdicts.length} of 4 AI engines available)
            </p>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{aName}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(aVotes / successfulVerdicts.length) * 100}%` }}
                  />
                </div>
                <span className="font-bold min-w-[3rem] text-right">{aVotes}/{successfulVerdicts.length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{bName}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${(bVotes / successfulVerdicts.length) * 100}%` }}
                  />
                </div>
                <span className="font-bold min-w-[3rem] text-right">{bVotes}/{successfulVerdicts.length}</span>
              </div>
            </div>
            {consensusWinner && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold">
                  ✨ {successfulVerdicts.filter(v => v.winner === consensusWinner).length} of {Math.min(successfulVerdicts.length, 4)} AI engines recommend <span className="ml-1">{consensusWinner}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Comparison Table */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Feature Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">{aName}</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">{bName}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(featureMatrix).map(([feature, [aHas, bHas]], idx) => (
              <tr key={feature} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
                <td className="py-3 px-4 text-foreground">{feature}</td>
                <td className="py-3 px-4 text-center">
                  {aHas ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {bHas ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold rounded-lg"
          onClick={() => window.open(`/software/${software}`, "_self")}
        >
          Get {aName} →
        </Button>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold rounded-lg"
          onClick={() => window.open(`/software/${competitor}`, "_self")}
        >
          Get {bName} →
        </Button>
      </div>
    </div>
  );
};

export default ComparePage;
