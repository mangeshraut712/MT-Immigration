import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // Supported locales with actual message bundles present in src/messages
    locales: [
        'en',
        'es',
        'ur',
        'hi',
        'bn',
        'pa',
        'ar',
        'fa',
        'tl',
        'zh',
        'vi',
        'ko'
    ],

    // Used when no locale matches
    defaultLocale: 'en'
});

export function getLocalePrefix(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const locales = routing.locales as readonly string[];

    if (firstSegment && locales.includes(firstSegment)) {
        return `/${firstSegment}`;
    }

    return '';
}

export function localizeHref(pathname: string, href: string) {
    if (!href.startsWith('/')) {
        return href;
    }

    const localePrefix = getLocalePrefix(pathname);
    if (!localePrefix) {
        return href;
    }

    if (href === '/' || href.startsWith('/#')) {
        if (href === '/') {
            return localePrefix;
        }

        return `${localePrefix}${href.slice(1)}`;
    }

    if (href === '/') {
        return localePrefix;
    }

    return href;
}
