import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://andersdev.com.br";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/apps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/recursos/spec-app-startup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // Service pages (Etapa 2)
    // { url: `${baseUrl}/servicos/desenvolvimento-saas-mvp`, ... },
  ];
}
