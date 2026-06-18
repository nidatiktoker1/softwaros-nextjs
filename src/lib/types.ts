export type Shortcut = { action: string; keys: string };
export type Shortcuts = {
  windows: Shortcut[];
  mac: Shortcut[];
  iphone?: Shortcut[];
  android?: Shortcut[];
};
export type PricingTier = { tier: string; price: number; period: string };

export type Software = {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  category_id: string | null;
  logo: string | null;
  logo_url: string | null;
  affiliate_link: string | null;
  affiliate_url: string | null;
  description: string | null;
  tagline: string | null;
  shortcuts: Shortcuts | any[];
  shortcuts_count: number | null;
  pricing: PricingTier[] | any;
  pricing_data: any;
  starting_price: number | null;
  has_free_tier: boolean | null;
  competitors: string[] | any;
  pros: any;
  cons: any;
  best_for_tags: string[] | null;
  trust_score: number | null;
  is_trending: boolean;
  is_new: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  learning_curve: string | null;
  ease_label: string | null;
  platforms: any;
  entity_type: string; // 'software', 'service', 'template', 'plugin'
  created_at: string;
};