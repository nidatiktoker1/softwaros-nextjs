import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <section className="container py-20">
        <div className="max-w-3xl space-y-8 prose prose-invert">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Introduction</h2>
            <p className="text-muted-foreground">
              SoftwareOS ("we," "us," "our," or "Company") operates the SoftwareOS website and service.
              This page informs you of our policies regarding the collection, use, and disclosure of personal
              data when you use our Service and the choices you have associated with that data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Information Collection and Use</h2>
            <p className="text-muted-foreground">
              We collect several different types of information for various purposes to provide and improve our Service.
            </p>
            <ul className="space-y-2 text-muted-foreground mt-3">
              <li className="flex gap-3"><span className="text-primary">▸</span> Account information (email, password)</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Usage data and analytics</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Device information and cookies</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Comparison and review data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Security of Data</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us but remember that no method of transmission over the
              Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
              means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@softwaros.com" className="text-primary hover:text-primary-glow">
                hello@softwaros.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20 border-t border-border text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border/40 text-foreground hover:border-primary/40 font-mono text-sm font-bold transition"
        >
          Back to home
        </Link>
      </section>
    </div>
  );
}
