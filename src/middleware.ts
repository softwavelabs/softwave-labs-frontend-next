import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'pl'/*, 'de', 'fr', 'es', 'it'*/];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (localeCookie && locales.includes(localeCookie)) {
        return localeCookie;
    }

    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
        if (locales.includes(browserLocale)) {
            return browserLocale;
        }
    }

    return defaultLocale;
}

function buildCsp(nonce: string): string {
    return `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob:;
        font-src 'self';
        connect-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();
}

export function middleware(request: NextRequest) {
    const locale = getLocale(request);
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const csp = buildCsp(nonce);
    const isHttps = request.nextUrl.protocol === 'https:';

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', csp);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: isHttps,
    });

    response.headers.set('x-locale', locale);
    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};