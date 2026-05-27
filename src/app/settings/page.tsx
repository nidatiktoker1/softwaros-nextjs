"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function SettingsPage() {
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
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize your SoftwareOS experience
        </p>
      </section>

      <section className="container py-20 max-w-2xl space-y-6">
        {/* Preferences */}
        <div className="glass glass-hover p-8 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <label className="text-sm">Email Notifications</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <label className="text-sm">Price Drop Alerts</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <label className="text-sm">New Tool Announcements</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass glass-hover p-8 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Subscription</h2>
          <div className="py-3">
            <p className="text-sm text-muted-foreground mb-3">Current Plan</p>
            <p className="font-mono text-lg text-primary">Free</p>
          </div>
          <button className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-mono font-bold hover:shadow-glow transition mt-4">
            Upgrade to Pro
          </button>
        </div>

        {/* Danger Zone */}
        <div className="glass glass-hover p-8 rounded-lg border border-red-500/20">
          <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="px-4 py-2 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition text-sm font-mono font-bold">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
