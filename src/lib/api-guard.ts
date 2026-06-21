import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "softwaros-nextjs.vercel.app",
  "softwaros-nextjs-nidatiktoker1-2993s-projects.vercel.app",
  "localhost:3000",
];

/**
 * Rejects requests that don't appear to originate from our own site.
 * This is not bulletproof (Origin/Referer can be spoofed by non-browser
 * clients), but it stops casual abuse, scraping, and other websites from
 * embedding/calling these routes directly in a <script> from the browser,
 * which is the most common way these API-key-backed proxy routes get
 * discovered and drained by bots once a site is public.
 */
export function checkOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const host = origin.replace(/^https?:\/\//, "") || (referer ? new URL(referer).host : "");

  if (!host || !ALLOWED_HOSTS.some((allowed) => host === allowed)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
