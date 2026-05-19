/**
 * Decorative floating keyboard keys background for hero.
 */
const KEYS = [
  { label: "⌘", x: "8%", y: "20%", delay: "0s", rot: -8, size: "text-2xl" },
  { label: "Ctrl", x: "82%", y: "15%", delay: "1.2s", rot: 6, size: "text-sm" },
  { label: "Shift", x: "12%", y: "70%", delay: "2.4s", rot: 4, size: "text-sm" },
  { label: "⌥", x: "75%", y: "65%", delay: "0.6s", rot: -10, size: "text-2xl" },
  { label: "Tab", x: "45%", y: "10%", delay: "1.8s", rot: -4, size: "text-sm" },
  { label: "Esc", x: "90%", y: "45%", delay: "3s", rot: 8, size: "text-sm" },
  { label: "↵", x: "5%", y: "45%", delay: "0.9s", rot: 12, size: "text-xl" },
  { label: "Space", x: "55%", y: "82%", delay: "2.1s", rot: -6, size: "text-xs" },
  { label: "C", x: "30%", y: "40%", delay: "1.5s", rot: 2, size: "text-base" },
  { label: "V", x: "65%", y: "35%", delay: "2.7s", rot: -2, size: "text-base" },
];

export const FloatingKeys = () => {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {KEYS.map((k, i) => (
        <div
          key={i}
          className="absolute animate-float-key"
          style={{
            left: k.x,
            top: k.y,
            animationDelay: k.delay,
            // @ts-expect-error css var
            "--rot": `${k.rot}deg`,
          }}
        >
          <div
            className={`kbd ${k.size} opacity-20 hover:opacity-100 transition-opacity`}
            style={{ minWidth: "2.5rem", padding: "0.5rem 0.75rem" }}
          >
            {k.label}
          </div>
        </div>
      ))}
    </div>
  );
};
