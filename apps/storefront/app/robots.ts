import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/account"],
    },
    sitemap: "http://127.0.0.1:3000/sitemap.xml",
  };
}
