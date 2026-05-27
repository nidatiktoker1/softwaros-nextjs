import { useEffect, useMemo, useState } from "react";
import type { Shortcut } from "@/lib/types";

type Props = { softwareName: string; list: Shortcut[] };

const normalizeKey = (k: string) => {
  const map: Record<string, string> = {
    Control: "ctrl",
    Meta: "cmd",
    Shift: "shift",
    Alt: "alt",
    " ": "space",
    Escape: "esc",
    Enter: "enter",
    Tab: "tab",
  };
  return (map[k] ?? k).toLowerCase();
};

const chordToSet = (chord: string) =>
  new Set(
    chord
      .split("+")
      .map((p) => p.trim().toLowerCase())
      .map((p) => (p === "command" ? "cmd" : p === "control" ? "ctrl" : p === "option" ? "alt" : p)),
  );

const setEq = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
};

export const QuizMode = ({ softwareName, list }: Props) => {
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [skipped, setSkipped] = useState(0);

  const queue = useMemo(() => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [list, active]);

  const current = queue[idx];

  useEffect(() => {
    if (!active) return void 0;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "/") return; // don't hijack browser nav
      e.preventDefault();
      const next = new Set(pressed);
      next.add(normalizeKey(e.key));
      setPressed(next);

      if (current) {
        const target = chordToSet(current.keys);
        if (setEq(next, target)) {
          setFeedback("correct");
          setScore((s) => s + 10 + streak * 2);
          setStreak((s) => s + 1);
          setTimeout(() => {
            setFeedback("idle");
            setPressed(new Set());
            setIdx((i) => (i + 1) % queue.length);
          }, 450);
        }
      }
    };
    const up = () => setPressed(new Set());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [active, current, pressed, queue.length, streak]);

  const start = () => {
    setActive(true);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setSkipped(0);
    setFeedback("idle");
  };

  const skip = () => {
    setSkipped((s) => s + 1);
    setStreak(0);
    setFeedback("wrong");
    setTimeout(() => {
      setFeedback("idle");
      setPressed(new Set());
      setIdx((i) => (i + 1) % queue.length);
    }, 350);
  };

  if (!active) {
    return (
      <div className="glass p-6 my-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-lg">
              <span className="gradient-text-orange">Quiz mode</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Random {softwareName} shortcuts. Press the right combo. Build a streak.
            </p>
          </div>
          <button
            onClick={start}
            disabled={list.length === 0}
            className="px-5 py-2.5 rounded font-mono text-sm bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-glow transition disabled:opacity-50"
          >
            ▶ start quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass p-6 my-6 transition-colors ${
        feedback === "correct" ? "border-emerald-400/60" : feedback === "wrong" ? "border-red-400/60" : ""
      }`}
    >
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
        <span>question {idx + 1} / {queue.length}</span>
        <span>streak <span className="text-primary">×{streak}</span></span>
        <span>score <span className="text-primary">{score}</span></span>
        <span>skipped {skipped}</span>
      </div>

      <div className="text-center py-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-3">
          press the shortcut for
        </div>
        <div className="text-2xl md:text-3xl font-bold gradient-text">
          {current?.action}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 min-h-[3rem]">
          {pressed.size === 0 ? (
            <span className="text-xs font-mono text-muted-foreground">waiting for input...</span>
          ) : (
            Array.from(pressed).map((k) => (
              <span key={k} className="kbd kbd-active capitalize">{k}</span>
            ))
          )}
        </div>

        {feedback === "correct" && (
          <div className="mt-4 text-emerald-400 font-mono text-sm">✓ correct! +{10 + (streak - 1) * 2}</div>
        )}
        {feedback === "wrong" && (
          <div className="mt-4 text-red-400 font-mono text-sm">→ skipped: {current?.keys}</div>
        )}
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={() => setActive(false)}
          className="text-xs font-mono px-3 py-1.5 border border-border rounded hover:border-foreground/40 text-muted-foreground"
        >
          end quiz
        </button>
        <button
          onClick={skip}
          className="text-xs font-mono px-3 py-1.5 border border-border rounded hover:border-primary hover:text-primary transition"
        >
          skip / show answer →
        </button>
      </div>
    </div>
  );
};
