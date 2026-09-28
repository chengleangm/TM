import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/en/checkout",
        "/km/checkout",
        "/en/register",
        "/km/register",
        "/en/payment/",
        "/km/payment/",
      ],
    },
    sitemap: "https://kh.tm.org/sitemap.xml",
  };
}
