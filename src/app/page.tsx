import { createClient } from "@supabase/supabase-js";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
  return <HomeClient initialList={initialList} />;
}
