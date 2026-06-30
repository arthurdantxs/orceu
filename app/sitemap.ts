import type { MetadataRoute } from "next";
import {
  getRadarArticleIsoDate,
  getRadarCategories,
  radarArticles,
} from "@/lib/radar-news";
import { getSiteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const categories = getRadarCategories();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/radar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/radar/feed.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...categories.map((category) => ({
      url: `${siteUrl}/radar/categoria/${category.slug}`,
      lastModified: new Date(
        getRadarArticleIsoDate(category.articles[0]?.date ?? "01 de janeiro de 2026"),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...radarArticles.map((article) => ({
      url: `${siteUrl}/radar/${article.id}`,
      lastModified: new Date(getRadarArticleIsoDate(article.date)),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
