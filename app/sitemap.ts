import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteConfig.url}/search`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.4
    },
    ...posts
  ];
}
