import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
          Terms of Service
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <section className="container py-20">
        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily download one copy of the materials (information or software) on
              SoftwareOS's website for personal, non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 text-muted-foreground mt-3">
              <li className="flex gap-3"><span className="text-primary">▸</span> Modify or copy the materials</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Use the materials for any commercial purpose or for any public display</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Attempt to decompile or reverse engineer any software contained on the site</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Remove any copyright or other proprietary notations from the materials</li>
              <li className="flex gap-3"><span className="text-primary">▸</span> Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on SoftwareOS's website are provided on an 'as is' basis. SoftwareOS makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall SoftwareOS or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on SoftwareOS's website, even if SoftwareOS or an authorized representative has been
              notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at{' '}
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
