import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が不要なパス
const publicPaths = ['/login', '/signup'];

// 認証が必要なパス
const protectedPaths = ['/', '/transactions', '/categories', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token');

  // 公開パスの場合
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    // 既にログインしている場合はダッシュボードへリダイレクト
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 保護されたパスの場合
  if (protectedPaths.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    // 未認証の場合はログインページへリダイレクト
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // リダイレクト後に元のページに戻れるようにクエリパラメータを追加
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Middlewareを適用するパスの設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
