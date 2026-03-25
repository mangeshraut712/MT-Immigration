import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

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

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export function getLocalePrefix(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const locales = routing.locales as readonly string[];

    if (firstSegment && locales.includes(firstSegment)) {
        return `/${firstSegment}`;
    }

    return '';
}

export function stripLocalePrefix(pathname: string) {
    if (!pathname.startsWith('/')) {
        return pathname;
    }

    const segments = pathname.split('/').filter(Boolean);
    const [firstSegment, ...rest] = segments;
    const locales = routing.locales as readonly string[];

    if (firstSegment && locales.includes(firstSegment)) {
        return rest.length > 0 ? `/${rest.join('/')}` : '/';
    }

    return pathname || '/';
}

export function localizeHrefForLocale(locale: string, href: string) {
    if (!href.startsWith('/')) {
        return href;
    }

    if (!href || href === '/') {
        return `/${locale}`;
    }

    if (href.startsWith('/#')) {
        return `/${locale}${href.slice(1)}`;
    }

    if (href.startsWith(`/${locale}`)) {
        return href;
    }

    return `/${locale}${href}`;
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
