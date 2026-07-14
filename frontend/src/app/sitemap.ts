import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vectoriarentcar.com";
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/fleet`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/offers`, lastModified: new Date() },
  ];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/vehicles`);
    const data = await res.json();
    const vehicles = (data.data || []).map((v: { id: number }) => ({
      url: `${baseUrl}/fleet/${v.id}`,
      lastModified: new Date(),
    }));
    return [...staticPages, ...vehicles];
  } catch {
    return staticPages;
  }
}
