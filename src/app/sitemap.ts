import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return [
        {
            url: siteUrl.toString(),
            lastModified,
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: new URL('/privacy', siteUrl).toString(),
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: new URL('/terms', siteUrl).toString(),
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: new URL('/brief-break', siteUrl).toString(),
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.4,
        },
        {
            url: new URL('/insights', siteUrl).toString(),
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: new URL('/llms.txt', siteUrl).toString(),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.2,
        },
        {
            url: new URL('/openapi.json', siteUrl).toString(),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.2,
        },
    ];
}
