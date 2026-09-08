import type { MetadataRoute } from 'next';
import { PATHS } from '@/lib/paths';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}${PATHS.visibilite}`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}${PATHS.mentionsLegales}`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: `${SITE_URL}${PATHS.politiqueConfidentialite}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
