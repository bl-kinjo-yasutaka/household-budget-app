'use client';

import { useAuth } from '@/src/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/common/Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ログインページにリダイレクト中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📊</span>
                ダッシュボード
              </Link>
              <Link
                href="/transactions"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/transactions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📝</span>
                取引一覧
              </Link>
              <Link
                href="/transactions/new"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/transactions/new'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">➕</span>
                取引登録
              </Link>
              <Link
                href="/categories"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/categories'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🏷️</span>
                カテゴリ管理
              </Link>
              <Link
                href="/settings"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/settings'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">⚙️</span>
                設定
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
