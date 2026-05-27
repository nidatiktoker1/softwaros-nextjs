"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-20 md:py-28 border-b border-border">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight gradient-text mb-6">
          Your Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences
        </p>
      </section>

      <section className="container py-20 max-w-2xl">
        <div className="glass glass-hover p-8 rounded-lg space-y-6">
          <div>
            <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
              Email Address
            </label>
            <p className="text-lg font-mono">{session.user?.email}</p>
          </div>

          <div className="border-t border-border/40 pt-6">
            <h3 className="font-bold mb-4">Account Created</h3>
            <p className="text-sm text-muted-foreground">
              {session.user?.created_at
                ? new Date(session.user.created_at).toLocaleDateString()
                : "Not available"}
            </p>
          </div>

          <div className="border-t border-border/40 pt-6">
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
              className="px-4 py-2 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition text-sm font-mono font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
