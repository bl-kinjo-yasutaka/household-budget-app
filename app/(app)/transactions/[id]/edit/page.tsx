'use client';

import React from 'react';
import { TransactionFormTabs } from '@/components/features/transactions/transaction-form-tabs';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGetTransactionsId } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';

export default function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const transactionId = parseInt(id);

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useGetTransactionsId(transactionId, {
    query: { enabled: !isNaN(transactionId) },
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetCategories();

  if (isNaN(transactionId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">無効な取引IDです</p>
      </div>
    );
  }

  if (isTransactionLoading || isCategoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <EmptyState
        title="取引編集"
        description="カテゴリの読み込みに失敗しました。"
        actionLabel="再試行"
        actionHref={`/transactions/${id}/edit`}
        showBackButton={true}
      />
    );
  }

  // Check if categories exist
  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="取引編集"
        description="カテゴリが登録されていません。先にカテゴリを作成してください。"
        actionLabel="カテゴリ管理へ"
        actionHref="/categories"
        showBackButton={true}
      />
    );
  }

  if (transactionError || !transaction) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">取引編集</h1>
            <p className="text-muted-foreground">取引が見つかりません</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">指定された取引が見つかりません。</p>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/transactions">取引一覧に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <TransactionFormTabs transaction={transaction} categories={categories} />;
}
