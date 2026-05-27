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
  category_id: string | null;
  logo: string | null;
  affiliate_link: string | null;
  description: string | null;
  shortcuts: Shortcuts | any[];
  pricing: PricingTier[] | any;
  competitors: string[] | any;
  pros: any;
  cons: any;
  trust_score: number | null;
  is_trending: boolean;
  is_new_arrival: boolean;
  learning_curve: string | null;
  platforms: any;
  created_at: string;
};
