import { NextResponse, NextRequest } from 'next/server';

const locales = ['en-US', 'de-DE', 'nl-NL'];

function getLocale(request: NextRequest) {
  const cookie = request.cookies.get('NEXT_LOCALE');
  if (cookie && locales.includes(cookie.value)) {
    return cookie.value;
  }

  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => {
        // Match language code with available locales
        return locales.some((locale) =>
          locale.toLowerCase().startsWith(lang.toLowerCase())
        );
      });

    if (preferredLocale) {
      const matchedLocale = locales.find((locale) =>
        locale.toLowerCase().startsWith(preferredLocale.toLowerCase())
      );
      if (matchedLocale) return matchedLocale;
    }
  }

  return 'en-US';
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);
  const response = NextResponse.next();

  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
