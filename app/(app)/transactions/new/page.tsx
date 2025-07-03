'use client';

import { TransactionFormTabs } from '@/components/features/transactions/dynamic-forms';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NetworkErrorState, NotFoundErrorState } from '@/components/ui/error-state';

export default function NewTransactionPage() {
  const { data: categories, isLoading, error, refetch } = useGetCategories();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">収支入力</h1>
          <p className="text-muted-foreground">新しい取引を記録します</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingIndicator variant="form-skeleton" count={4} />
      ) : error ? (
        <Card>
          <CardContent className="py-6">
            <NetworkErrorState onRetry={() => refetch()} />
          </CardContent>
        </Card>
      ) : !categories || categories.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <NotFoundErrorState
              title="カテゴリが登録されていません"
              message="先にカテゴリを作成してください。"
              showHomeLink={false}
            />
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link href="/categories">カテゴリ管理へ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TransactionFormTabs categories={categories} />
      )}
    </div>
  );
}
