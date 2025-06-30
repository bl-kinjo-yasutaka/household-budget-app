import { TransactionFormTabs } from '@/components/features/transactions/transaction-form-tabs';
import { EmptyState } from '@/components/common/empty-state';
import { mockCategories } from '@/src/mocks/handlers';
import type { Category } from '@/src/api/generated/model';

async function getCategories(): Promise<Category[]> {
  // In real implementation, this would be an API call
  return mockCategories;
}

export default async function NewTransactionPage() {
  const categories = await getCategories();

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
