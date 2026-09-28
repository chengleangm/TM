import type { MetadataRoute } from "next";
import { repository } from "@/services/repository";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await repository();
  const paths = [
    ...db.pages
      .filter((p) => p.published && !["register", "checkout"].includes(p.slug))
      .map((p) => (p.slug === "home" ? "" : `/${p.slug}`)),
    ...db.courses
      .filter((c) => c.status !== "archived")
      .map((c) => `/courses/${c.slug}`),
    ...db.teachers.filter((t) => t.published).map((t) => `/teachers/${t.slug}`),
    ...db.centers.filter((c) => c.published).map((c) => `/centers/${c.slug}`),
  ];
  return paths.flatMap((path) =>
    ["en", "km"].map((lang) => ({
      url: `https://kh.tm.org/${lang}${path}`,
      changeFrequency: "weekly" as const,
      priority: path ? 0.7 : 1,
      alternates: {
        languages: {
          en: `https://kh.tm.org/en${path}`,
          km: `https://kh.tm.org/km${path}`,
        },
      },
    })),
  );
}
