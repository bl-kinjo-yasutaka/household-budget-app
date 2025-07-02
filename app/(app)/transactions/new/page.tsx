'use client';

import { TransactionFormTabs } from '@/components/features/transactions/transaction-form-tabs';
import { EmptyState } from '@/components/common/empty-state';
import { useGetCategories } from '@/src/api/generated/categories/categories';

export default function NewTransactionPage() {
  const { data: categories, isLoading, error } = useGetCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        description="カテゴリの読み込みに失敗しました。"
        actionLabel="再試行"
        actionHref="/transactions/new"
      />
    );
  }

  // Check if categories exist
  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        description="カテゴリが登録されていません。先にカテゴリを作成してください。"
        actionLabel="カテゴリ管理へ"
        actionHref="/categories"
      />
    );
  }

  return <TransactionFormTabs categories={categories} />;
}
