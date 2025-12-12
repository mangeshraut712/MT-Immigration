import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

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
            url: new URL('#services', siteUrl).toString(),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: new URL('#contact', siteUrl).toString(),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
