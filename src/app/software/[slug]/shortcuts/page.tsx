import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ShortcutsClient from "./ShortcutsClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

export const dynamic = "force-dynamic";

async function fetchToolAndShortcuts(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [toolRes, shortcutsRes] = await Promise.all([
    supabase.from("tools").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("shortcuts").select("*").eq("tool_slug", slug).order("category"),
  ]);
  return {
    tool: !toolRes.error && toolRes.data ? toolRes.data : undefined,
    shortcuts: !shortcutsRes.error && shortcutsRes.data ? shortcutsRes.data : undefined,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  let toolName: string | undefined;
  try {
    const { tool } = await fetchToolAndShortcuts(slug);
    toolName = tool?.name;
  } catch {
    toolName = undefined;
  }
  const name = toolName ?? slug;
  const title = `${name} Keyboard Shortcuts 2026 — Windows & Mac | SoftwareOS`;
  const description = `Complete keyboard shortcuts for ${name}: Windows and Mac key combinations, productivity hotkeys, and quick reference tables on SoftwareOS.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${slug}/shortcuts` },
    openGraph: { title, description, url: `${SITE_URL}/software/${slug}/shortcuts`, type: "website" },
  };
}

export default async function ShortcutsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let initialTool: any = undefined;
  let initialShortcuts: any[] | undefined;
  try {
    const { tool, shortcuts } = await fetchToolAndShortcuts(slug);
    initialTool = tool;
    initialShortcuts = shortcuts;
  } catch {
    // Server fetch unavailable: client falls back to its browser fetch.
    initialTool = undefined;
    initialShortcuts = undefined;
  }
  return <ShortcutsClient initialTool={initialTool} initialShortcuts={initialShortcuts} />;
}
