import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/data/services";
import { getAllPosts } from "@/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.andersdev.com.br";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculadora-site`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculadora-app`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/apps/calculadora`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/para-startups`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/para-pmes-brasil`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/agencias-parceiras`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/trabalhar-comigo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/recursos/spec-app-startup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = getServiceSlugs().map((slug) => ({
    url: `${baseUrl}/servicos/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
