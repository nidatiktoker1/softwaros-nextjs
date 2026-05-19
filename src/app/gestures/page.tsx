"use client"
import { useState } from "react";
import { Seo } from "@/components/Seo";

type Platform = "ios" | "android";

type Gesture = {
  name: string;
  description: string;
  diagram: "tap" | "swipe-up" | "swipe-down" | "swipe-left" | "swipe-right" | "pinch" | "long-press" | "two-finger";
};

const DATA: Record<Platform, Gesture[]> = {
  ios: [
    { name: "Open App Switcher", description: "Swipe up from bottom and pause in the middle of the screen.", diagram: "swipe-up" },
    { name: "Go Home", description: "Quick swipe up from the bottom edge.", diagram: "swipe-up" },
    { name: "Control Center", description: "Swipe down from the top-right corner.", diagram: "swipe-down" },
    { name: "Notification Center", description: "Swipe down from the top-left or middle.", diagram: "swipe-down" },
    { name: "Back / Previous Screen", description: "Swipe right from the very left edge.", diagram: "swipe-right" },
    { name: "Spotlight Search", description: "Swipe down anywhere on the home screen.", diagram: "swipe-down" },
    { name: "Quick App Switch", description: "Swipe left or right along the bottom edge.", diagram: "swipe-left" },
    { name: "Reachability", description: "Swipe down on the bottom edge (single quick gesture).", diagram: "swipe-down" },
    { name: "Zoom Photo", description: "Pinch out with two fingers.", diagram: "pinch" },
    { name: "Action Menu", description: "Long-press an app icon or item.", diagram: "long-press" },
  ],
  android: [
    { name: "Go Home", description: "Swipe up from the bottom edge.", diagram: "swipe-up" },
    { name: "Open Recents", description: "Swipe up from the bottom and hold.", diagram: "swipe-up" },
    { name: "Back", description: "Swipe in from the left or right edge.", diagram: "swipe-right" },
    { name: "Notifications", description: "Swipe down from the top of the screen.", diagram: "swipe-down" },
    { name: "Quick Settings", description: "Swipe down twice from the top, or with two fingers.", diagram: "two-finger" },
    { name: "Switch Apps", description: "Swipe left or right along the bottom edge.", diagram: "swipe-left" },
    { name: "Google Assistant", description: "Swipe up diagonally from the bottom corners.", diagram: "swipe-up" },
    { name: "Split Screen", description: "Open Recents, long-press an app icon, then choose Split.", diagram: "long-press" },
    { name: "Screenshot", description: "Press Power + Volume Down at the same time.", diagram: "tap" },
    { name: "One-Handed Mode", description: "Swipe down on the gesture bar at the bottom.", diagram: "swipe-down" },
  ],
};

const Diagram = ({ kind }: { kind: Gesture["diagram"] }) => {
  // Stylized phone outline + animated finger / arrow per gesture.
  const arrow = (rot: number) => (
    <g transform={`rotate(${rot} 60 95)`}>
      <line x1="60" y1="120" x2="60" y2="70" stroke="hsl(18 100% 60%)" strokeWidth="3" strokeLinecap="round" />
      <polyline points="50,80 60,68 70,80" fill="none" stroke="hsl(18 100% 60%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );

  return (
    <svg viewBox="0 0 120 200" className="w-full h-40" aria-hidden>
      <rect x="20" y="10" width="80" height="180" rx="14" fill="hsl(0 0% 7%)" stroke="hsl(0 0% 20%)" strokeWidth="2" />
      <rect x="28" y="22" width="64" height="156" rx="6" fill="hsl(0 0% 4%)" />
      <rect x="50" y="14" width="20" height="3" rx="1.5" fill="hsl(0 0% 25%)" />

      {kind === "tap" && (
        <g>
          <circle cx="60" cy="100" r="10" fill="hsl(18 100% 50% / 0.25)">
            <animate attributeName="r" values="6;18;6" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="100" r="5" fill="hsl(18 100% 60%)" />
        </g>
      )}
      {kind === "long-press" && (
        <g>
          <circle cx="60" cy="100" r="14" fill="none" stroke="hsl(18 100% 60%)" strokeWidth="2">
            <animate attributeName="stroke-dasharray" values="0 88;88 0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="100" r="5" fill="hsl(18 100% 60%)" />
        </g>
      )}
      {kind === "swipe-up" && (
        <g>
          {arrow(0)}
          <animateTransform attributeName="transform" type="translate" values="0 30; 0 -30; 0 30" dur="1.8s" repeatCount="indefinite" />
        </g>
      )}
      {kind === "swipe-down" && (
        <g>
          {arrow(180)}
          <animateTransform attributeName="transform" type="translate" values="0 -30; 0 30; 0 -30" dur="1.8s" repeatCount="indefinite" />
        </g>
      )}
      {kind === "swipe-left" && (
        <g>
          {arrow(-90)}
          <animateTransform attributeName="transform" type="translate" values="30 0; -30 0; 30 0" dur="1.8s" repeatCount="indefinite" />
        </g>
      )}
      {kind === "swipe-right" && (
        <g>
          {arrow(90)}
          <animateTransform attributeName="transform" type="translate" values="-30 0; 30 0; -30 0" dur="1.8s" repeatCount="indefinite" />
        </g>
      )}
      {kind === "pinch" && (
        <g>
          <circle cx="45" cy="100" r="5" fill="hsl(18 100% 60%)">
            <animate attributeName="cx" values="45;35;45" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="100" r="5" fill="hsl(18 100% 60%)">
            <animate attributeName="cx" values="75;85;75" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {kind === "two-finger" && (
        <g>
          <circle cx="50" cy="80" r="5" fill="hsl(18 100% 60%)">
            <animate attributeName="cy" values="80;120;80" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="80" r="5" fill="hsl(18 100% 60%)">
            <animate attributeName="cy" values="80;120;80" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
};

const Gestures = () => {
  const [platform, setPlatform] = useState<Platform>("ios");
  const list = DATA[platform];
  const url = typeof window !== "undefined" ? window.location.href : "";

  const title = `iPhone & Android Gestures Cheat Sheet — Animated Diagrams | SoftwareOS`;
  const description = `Master every iOS and Android gesture: swipes, taps, long-press and multi-touch. Animated diagrams for both platforms, side by side.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Mobile gesture cheat sheet (${platform === "ios" ? "iOS" : "Android"})`,
    description,
    step: list.map((g, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: g.name,
      text: g.description,
    })),
  };

  return (
    <div className="container py-12 max-w-6xl">
      <Seo title={title} description={description} schema={schema} canonical={url} />

      <div className="mb-10">
        <p className="text-primary text-xs font-mono mb-2">$ gestures --platform={platform}</p>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Mobile gestures, demystified.</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Every essential swipe, tap and pinch — animated, side by side, for both iOS and Android.
        </p>
      </div>

      <div className="inline-flex border border-border rounded-lg p-1 bg-card mb-8">
        {(["ios", "android"] as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-5 py-2 text-sm font-mono rounded-md transition ${
              platform === p
                ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "ios" ? "iPhone / iOS" : "Android"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((g) => (
          <article key={g.name} className="glass glass-hover p-5">
            <Diagram kind={g.diagram} />
            <h2 className="font-bold mt-3">{g.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Gestures;


