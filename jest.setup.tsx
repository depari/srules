import '@testing-library/jest-dom';
import React from 'react';

// TextEncoder/TextDecoder polyfill for JSDOM
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// Mock IntersectionObserver
const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();
window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve,
    disconnect,
    takeRecords: () => [],
    root: null,
    rootMargin: '',
    thresholds: [],
})) as any;

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
        };
    },
    usePathname() {
        return '/ko';
    },
    useSearchParams: jest.fn(() => new URLSearchParams()),
    useParams() {
        return { locale: 'ko' };
    }
}));

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => 'ko',
}));

// Mock @/i18n/routing
jest.mock('@/i18n/routing', () => ({
    Link: ({ children, href, ...props }: any) => <a href={href} {...props} > {children} </a>,
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
    usePathname: () => '/ko',
    routing: {
        locales: ['ko', 'en'],
        defaultLocale: 'ko'
    }
}));
