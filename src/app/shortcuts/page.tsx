import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ShortcutsClient from "./ShortcutsClient";

const SITE_URL = "https://softwaros-nextjs.vercel.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Software Keyboard Shortcuts 2026 — Windows & Mac Hotkeys | SoftwareOS",
  description:
    "Keyboard shortcuts for the most popular software: VS Code, Bitwarden, Keeper and 170+ more tools. Windows and Mac hotkeys, searchable and compared on SoftwareOS.",
  alternates: { canonical: `${SITE_URL}/shortcuts` },
  openGraph: {
    title: "Software Keyboard Shortcuts 2026 — SoftwareOS",
    description:
      "Keyboard shortcuts for 170+ software tools — Windows and Mac hotkeys in one searchable place.",
    url: `${SITE_URL}/shortcuts`,
    type: "website",
  },
};

export default async function ShortcutsPage() {
  let initialList: any[] | undefined;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.from("tools").select("*").order("name");
    if (!error && data) initialList = data;
  } catch {
    // Server fetch unavailable: client falls back to its browser fetch.
    initialList = undefined;
  }
  return <ShortcutsClient initialList={initialList} />;
}
