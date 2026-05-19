import { useEffect, useState } from "react";

const COUNCIL = [
  {
    name: "Gemini",
    color: "from-blue-400 to-purple-500",
    glyph: "✦",
    line: "Figma wins for collaborative design — real-time multiplayer is unmatched.",
  },
  {
    name: "Groq",
    color: "from-red-400 to-orange-500",
    glyph: "⚡",
    line: "Photoshop has 30+ years of pixel mastery. No contest for raster work.",
  },
  {
    name: "Mistral",
    color: "from-cyan-400 to-blue-500",
    glyph: "◇",
    line: "VS Code dominates IDEs: extensions, speed, free. Cursor only beats it for AI.",
  },
  {
    name: "Cohere",
    color: "from-emerald-400 to-teal-500",
    glyph: "◉",
    line: "Excel still rules finance. Sheets wins for collaboration. Pick by team.",
  },
];

const Typer = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(text); return; }
    const startAt = performance.now() + delay;
    const tick = (now: number) => {
      if (now < startAt) { raf = requestAnimationFrame(tick); return; }
      const elapsed = now - startAt;
      const target = Math.min(text.length, Math.floor(elapsed / 22));
      if (target !== i) { i = target; setShown(text.slice(0, i)); }
      if (i < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return (
    <span>
      {shown}
      <span className="animate-caret text-primary">▍</span>
    </span>
  );
};

export const AICouncil = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {COUNCIL.map((c, i) => (
        <div key={c.name} className="glass glass-hover p-5 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
              {c.glyph}
            </div>
            <div>
              <div className="font-bold text-sm">{c.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                council member
              </div>
            </div>
            <span className="ml-auto text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              live
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-mono leading-relaxed min-h-[3.5rem]">
            <Typer text={c.line} delay={i * 600} />
          </p>
        </div>
      ))}
    </div>
  );
};
