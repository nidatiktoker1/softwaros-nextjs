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
  logo: string | null;
  affiliate_link: string | null;
  description: string | null;
  shortcuts: Shortcuts;
  pricing: PricingTier[];
  competitors: string[];
};
