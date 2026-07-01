import type { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "All Software Categories — Compare Tools by Category | SoftwareOS",
  description: "Browse all 27 software categories on SoftwareOS. Compare paid and open-source tools side by side with real pricing, shortcuts, and AI-powered comparisons. Find the best software for every need.",
  alternates: { canonical: "https://softwaros-nextjs.vercel.app/categories" },
  openGraph: {
    title: "All Software Categories — SoftwareOS",
    description: "Browse all 27 software categories on SoftwareOS. Compare paid and open-source tools side by side.",
    url: "https://softwaros-nextjs.vercel.app/categories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Software Categories — SoftwareOS",
    description: "Browse all 27 software categories on SoftwareOS. Compare paid and open-source tools side by side.",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
