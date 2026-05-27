import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract domain from URL or return the input as-is
 */
export function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return null;
  }
}

/**
 * Get logo URL with Clearbit fallback
 * Returns emoji logo, or Clearbit URL for image-based logo
 */
export function getLogoUrl(emojiLogo: string | null, affiliateLink: string | null): string | null {
  // If emoji logo exists, return it as-is (for display)
  if (emojiLogo) {
    return emojiLogo;
  }

  // Try to extract domain from affiliate link for Clearbit
  const domain = extractDomain(affiliateLink);
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }

  return null;
}

