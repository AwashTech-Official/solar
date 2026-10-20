import { MetadataRoute } from 'next';
import { siteConfig } from '@/src/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || siteConfig.seo.siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
