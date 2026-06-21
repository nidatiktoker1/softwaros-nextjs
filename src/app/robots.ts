import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/signup", "/settings", "/profile", "/auth/", "/api/"],
    },
    sitemap: "https://softwaros-nextjs.vercel.app/sitemap.xml",
  };
}
