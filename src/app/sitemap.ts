import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://vidyaraut.vercel.app'
    const locales = ['en', 'hi', 'mr']
    const lastModified = new Date()

    // Generate sitemap entries for each locale
    const localizedEntries = locales.flatMap((locale) => [
        {
            url: `${baseUrl}/${locale}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/${locale}#skills`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/${locale}#projects`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/${locale}#experience`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/${locale}#contact`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ])

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...localizedEntries,
    ]
}
