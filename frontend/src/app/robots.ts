import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/agent/', '/dashboard/'],
    },
    sitemap: 'https://vectoria-rent.com/sitemap.xml',
  }
}
