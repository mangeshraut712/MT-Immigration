import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            pathname: '/',
            query: '',
            asPath: '/',
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations() {
        return (key) => key;
    },
    useLocale() {
        return 'en';
    },
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn().mockImplementation(id => clearTimeout(id));

// Mock performance.mark
Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
        ...window.performance,
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn(() => []),
    },
});