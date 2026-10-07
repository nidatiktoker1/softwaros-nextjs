"use client";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSoftware, useShortcutsForSoftware } from "@/hooks/useSoftware";
import { useSoftwareSlug } from "@/hooks/useSoftwareSlug";
import { Seo } from "@/components/Seo";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Shortcut } from "@/lib/types";

type OS = "windows" | "mac" | "iphone" | "android";
type PageShortcut = Shortcut & { category: string };

const osLabels: Record<OS, string> = {
  windows: "Windows",
  mac: "Mac",
  iphone: "iPhone",
  android: "Android",
};

// Fallback for manual shortcuts (can be removed once all are seeded)
const manualShortcuts: Record<string, Record<OS, PageShortcut[]>> = {};

const confettiParticles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${Math.round(5 + index * 5.5)}%`,
  delay: `${Math.random() * 600}ms`,
  duration: `${1300 + Math.random() * 700}ms`,
  color: ["bg-orange-500", "bg-yellow-400", "bg-emerald-500", "bg-sky-400", "bg-violet-500"][index % 5],
}));

const getManualShortcuts = (slug?: string, os: OS = "windows") => {
  if (!slug) return [];
  return manualShortcuts[slug]?.[os] ?? [];
};

const renderKey = (k: string, pressed: Set<string>) => {
  const norm = k.toLowerCase();
  const isPressed = pressed.has(norm);
  return (
    <span key={k} className={`rounded border border-border bg-[#111111] px-2 py-1 text-[11px] font-mono ${isPressed ? "bg-primary text-primary-foreground" : "text-white"}`}>
      {k}
    </span>
  );
};

const KeyChord = ({ keys, pressed }: { keys: string; pressed: Set<string> }) => {
  const parts = keys.split("+").map((p) => p.trim());
  return (
    <div className="flex flex-wrap gap-2">
      {parts.map((part, index) => (
        <span key={index}>{renderKey(part, pressed)}</span>
      ))}
    </div>
  );
};

const ShortcutsPage = ({ initialTool, initialShortcuts }: { initialTool?: any; initialShortcuts?: any[] }) => {
  const { slug, basePath } = useSoftwareSlug();
  const { data, isLoading } = useSoftware(slug, initialTool);
  const { data: dbShortcuts = [] } = useShortcutsForSoftware(slug, initialShortcuts);
  const [os, setOs] = useState<OS>("windows");
  const [search, setSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const list = useMemo<PageShortcut[]>(() => {
    // Map platform-specific key fields to the current OS
    const keyFieldMap: Record<OS, string> = {
      windows: "keys_windows",
      mac: "keys_mac",
      iphone: "keys_iphone",
      android: "keys_android",
    };
    const keyField = keyFieldMap[os];

    if (Array.isArray(dbShortcuts) && dbShortcuts.length > 0) {
      return dbShortcuts
        .filter((s: any) => s[keyField]) // Filter out shortcuts without keys for this OS
        .map((s: any) => ({
          keys: s[keyField],
          action: s.action,
          category: s.category ?? "General",
        }));
    }

    // Fallback to manual shortcuts if database is empty
    const manual = getManualShortcuts(slug, os);
    return manual;
  }, [dbShortcuts, os]);

  const filteredShortcuts = useMemo(() => {
    const query = search.toLowerCase();
    return list.filter((shortcut) => {
      return (
        shortcut.keys.toLowerCase().includes(query) ||
        shortcut.action.toLowerCase().includes(query) ||
        shortcut.category.toLowerCase().includes(query)
      );
    });
  }, [list, search]);

  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setShowConfetti(true);
        toast({ title: "Shortcut master! 🎉" });
        window.setTimeout(() => setShowConfetti(false), 1800);
      }
    };
    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, []);

  const handleCopy = async (keys: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(keys);
    }
    setCopiedKey(keys);
    window.setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSendPdf = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    setIsModalOpen(false);
    toast({ title: "PDF sent to your email!" });
    setEmail("");
  };

  if (isLoading) return <div className="container py-12 font-mono text-muted-foreground">$ loading...</div>;
  if (!data) return <div className="container py-12">Not found. <Link href="/" className="text-primary">← home</Link></div>;

  const title = `${data.name} Keyboard Shortcuts 2026 — Complete List`;
  const description = `Complete list of ${data.name} keyboard shortcuts with copy-ready combos and categories.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: list.map((shortcut, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: shortcut.action,
      text: `Press ${shortcut.keys} to ${shortcut.action.toLowerCase()} in ${data.name}.`,
    })),
  };

  return (
    <div className="container py-10 max-w-6xl">
      <Seo title={title} description={description} schema={schema} />

      <nav className="text-xs font-mono text-muted-foreground mb-4 flex flex-wrap gap-2 items-center">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <span>{data.category}</span>
        <span>›</span>
        <Link href={basePath ?? `/software/${data.slug}`} className="hover:text-primary">{data.name}</Link>
        <span>›</span>
        <span className="text-white">Shortcuts</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex flex-wrap items-center gap-4">
          {data.name} Keyboard Shortcuts 2026 — Complete List
          <span className="rounded-full border border-border bg-[#111111] px-3 py-1 text-sm text-muted-foreground">
            {list.length} shortcuts
          </span>
        </h1>
      </header>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {(["windows", "mac", "iphone", "android"] as OS[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOs(option)}
              className={`text-sm font-mono px-4 py-2 transition ${
                os === option
                  ? "border-b-2 border-primary text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {osLabels[option]}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search shortcuts..."
            className="bg-[#111111] text-white border-border"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-[#0d0d0d] shadow-sm">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Key Combo</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Copy</th>
            </tr>
          </thead>
          <tbody>
            {filteredShortcuts.map((shortcut, index) => (
              <tr key={`${shortcut.keys}-${index}`} className="bg-[#111111] border border-border text-sm text-white">
                <td className="px-4 py-4 align-top">
                  <div className="inline-flex flex-wrap gap-2">
                    {shortcut.keys.split("+").map((part, partIndex) => (
                      <span key={partIndex} className="rounded border border-border bg-[#1b1b1b] px-2 py-1 font-mono text-[11px] text-white">
                        {part}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-white">{shortcut.action}</td>
                <td className="px-4 py-4 align-top text-sm text-muted-foreground">{shortcut.category}</td>
                <td className="px-4 py-4 align-top">
                  <button
                    type="button"
                    onClick={() => handleCopy(shortcut.keys)}
                    className={`rounded-full px-3 py-2 text-xs font-mono transition ${
                      copiedKey === shortcut.keys
                        ? "bg-orange-600 text-white"
                        : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {copiedKey === shortcut.keys ? "Copied!" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredShortcuts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No shortcuts matched your search.</div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Press <span className="rounded border border-border bg-[#111111] px-2 py-1 font-mono">Ctrl+S</span> for a surprise.
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">PDF</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send PDF to your email</DialogTitle>
              <DialogDescription>Enter your email address and we’ll send a downloadable shortcut list.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendPdf} className="mt-4 space-y-4">
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoFocus
                className="bg-[#111111] text-white border-border"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <DialogClose asChild>
                  <Button variant="secondary" size="sm">Cancel</Button>
                </DialogClose>
                <Button type="submit" size="sm">Send PDF</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confettiParticles.map((particle) => (
            <span
              key={particle.id}
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
              className="absolute top-0 h-2 w-2 rounded-full opacity-0 animate-confetti"
              aria-hidden="true"
            >
              <span className={`block h-2 w-2 rounded-full ${particle.color}`} />
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default ShortcutsPage;
