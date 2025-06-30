import { TransactionFormTabs } from '@/components/features/transactions/transaction-form-tabs';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { mockCategories, mockTransactions } from '@/src/mocks/handlers';
import type { Transaction, Category } from '@/src/api/generated/model';

async function getTransaction(id: number): Promise<Transaction | null> {
  // In real implementation, this would be an API call
  return mockTransactions.find((t) => t.id === id) || null;
}

async function getCategories(): Promise<Category[]> {
  // In real implementation, this would be an API call
  return mockCategories;
}

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transactionId = parseInt(id);

  if (isNaN(transactionId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">無効な取引IDです</p>
      </div>
    );
  }

  const [transaction, categories] = await Promise.all([
    getTransaction(transactionId),
    getCategories(),
  ]);

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

  if (!transaction) {
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
