'use client';

import { useAuth } from '@/src/contexts/auth-context';
import { UserSettingsProvider } from '@/src/contexts/user-settings-context';
import { UserSettingsErrorBoundary } from '@/components/common/user-settings-error-boundary';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from '@/components/common/Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">ログインページにリダイレクト中...</p>
        </div>
      </div>
    );
  }

  return (
    <UserSettingsErrorBoundary>
      <UserSettingsProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-6" role="main">
            {children}
          </main>
        </div>
      </UserSettingsProvider>
    </UserSettingsErrorBoundary>
  );
}
