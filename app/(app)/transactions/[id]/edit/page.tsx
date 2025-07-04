'use client';

import React from 'react';
import { TransactionFormTabs } from '@/components/features/transactions/dynamic-forms';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGetTransactionsId } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { NetworkErrorState, NotFoundErrorState } from '@/components/ui/ErrorState';

export default function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const transactionId = parseInt(id);

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
    refetch: refetchTransaction,
  } = useGetTransactionsId(transactionId, {
    query: { enabled: !isNaN(transactionId) },
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategories();

  // Early return for invalid ID
  if (isNaN(transactionId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">無効な取引IDです</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight">取引編集</h1>
          <p className="text-muted-foreground">取引情報を編集します</p>
        </div>
      </div>

      {/* Content */}
      {isTransactionLoading || isCategoriesLoading ? (
        <LoadingIndicator variant="form-skeleton" count={4} />
      ) : transactionError ? (
        <Card>
          <CardContent className="py-6">
            <NetworkErrorState onRetry={refetchTransaction} />
          </CardContent>
        </Card>
      ) : !transaction ? (
        <Card>
          <CardContent className="py-6">
            <NotFoundErrorState message="指定された取引が見つかりません。" showHomeLink={false} />
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link href="/transactions">取引一覧に戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : categoriesError ? (
        <Card>
          <CardContent className="py-6">
            <NetworkErrorState onRetry={() => refetchCategories()} />
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
        <TransactionFormTabs transaction={transaction} categories={categories} />
      )}
    </div>
  );
}
