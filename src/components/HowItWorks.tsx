const steps = [
  {
    n: "01",
    cmd: "$ pick --software",
    title: "Pick your tool",
    body: "Search 10,000+ apps across VPN, design, productivity, dev, AI and more.",
  },
  {
    n: "02",
    cmd: "$ ai-council --convene",
    title: "Let 4 AIs argue for you",
    body: "Gemini, Groq, Mistral and Cohere debate the comparison and reach a verdict in seconds.",
  },
  {
    n: "03",
    cmd: "$ ship --faster",
    title: "Save time & money",
    body: "Master shortcuts, get price-drop alerts, and stop second-guessing your stack.",
  },
];

export const HowItWorks = () => (
  <section className="container py-20 border-t border-border">
    <div className="reveal mb-10">
      <p className="text-primary text-xs font-mono mb-2">$ man softwareos</p>
      <h2 className="text-3xl md:text-4xl font-bold gradient-text">How it works</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <div
          key={s.n}
          className="glass glass-hover p-6 reveal relative overflow-hidden"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="absolute -top-2 -right-2 text-7xl font-bold text-primary/10 select-none">
            {s.n}
          </div>
          <p className="text-primary text-xs font-mono mb-3 relative">{s.cmd}</p>
          <h3 className="text-xl font-bold mb-2 relative">{s.title}</h3>
          <p className="text-sm text-muted-foreground relative">{s.body}</p>
        </div>
      ))}
    </div>
  </section>
);
