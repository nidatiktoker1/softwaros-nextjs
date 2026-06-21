import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Software } from "@/lib/types";

export const useSoftwareList = () =>
  useQuery({
    queryKey: ["software-list"],
    queryFn: async (): Promise<Software[]> => {
      const { data, error } = await (supabase as any).from("tools").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as unknown as Software[];
    },
  });

export const useSoftware = (slug?: string) =>
  useQuery({
    queryKey: ["software", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Software | null> => {
      const { data, error } = await (supabase as any).from("tools").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return (data as unknown as Software) ?? null;
    },
  });

export const useTrending = (limit = 6) =>
  useQuery({
    queryKey: ["software-trending", limit],
    queryFn: async (): Promise<Software[]> => {
      const { data, error } = await (supabase as any)
        .from("tools")
        .select("*")
        .eq("is_trending", true)
        .order("trust_score", { ascending: false, nullsFirst: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Software[];
    },
  });

export const useNewArrivals = (limit = 4) =>
  useQuery({
    queryKey: ["software-new", limit],
    queryFn: async (): Promise<Software[]> => {
      const { data, error } = await (supabase as any)
        .from("tools")
        .select("*")
        .eq("is_new", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Software[];
    },
  });

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
};

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await (supabase as any)
        .from("categories")
        .select("id,slug,name,icon,sort_order")
        .order("sort_order", { ascending: true });
      if (error) {
        console.error("Categories query error:", error);
        throw error;
      }
      return (data ?? []) as Category[];
    },
  });

export const useCategoryCounts = () =>
  useQuery({
    queryKey: ["category-counts"],
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await (supabase as any).from("tools").select("category_slug");
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        counts[row.category_slug] = (counts[row.category_slug] ?? 0) + 1;
      }
      return counts;
    },
  });

export const useShortcutsForSoftware = (slug?: string) =>
  useQuery({
    queryKey: ["shortcuts-for-software", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shortcuts")
        .select("*")
        .eq("tool_slug", slug!)
        .order("category");
      if (error) return [];
      return (data ?? []) as unknown as any[];
    },
  });
  export const useSoftwareByCategory = (categorySlug?: string) =>
  useQuery({
    queryKey: ["software-category", categorySlug],
    enabled: !!categorySlug,
    queryFn: async (): Promise<Software[]> => {
      const { data, error } = await (supabase as any)
        .from("tools")
        .select("*")
        .eq("category_slug", categorySlug!)
        .order("trust_score", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as unknown as Software[];
    },
  });