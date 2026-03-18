import { MetadataRoute } from 'next';
import { isProductionIndexable, siteUrl } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
    const isIndexable = isProductionIndexable();
    return {
        rules: isIndexable
            ? {
                userAgent: '*',
                allow: '/',
            }
            : {
                userAgent: '*',
                disallow: '/',
            },
        sitemap: new URL('/sitemap.xml', siteUrl).toString(),
        host: siteUrl.toString(),
    };
}
