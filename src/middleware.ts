import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'nb', 'is', 'pl'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    // Sprawdź cookie
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

export function middleware(request: NextRequest) {
    const locale = getLocale(request);
    const response = NextResponse.next();

    // Użyj set() z dwoma parametrami: name i value
    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 rok
        sameSite: 'lax',
    });

    response.headers.set('x-locale', locale);

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};