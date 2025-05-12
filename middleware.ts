import { NextResponse, NextRequest } from 'next/server';

const locales = ['en-US', 'de-DE', 'fr-FR'];

function getLocale(request: NextRequest) {
  const cookie = request.cookies.get('NEXT_LOCALE');
  if (cookie && locales.includes(cookie.value)) {
    return cookie.value;
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
