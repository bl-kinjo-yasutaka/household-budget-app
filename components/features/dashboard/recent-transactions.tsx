'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useGetTransactionsRecent } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { TransactionType } from '@/src/api/generated/model';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { formatDateShort } from '@/utils/format';
import { NetworkErrorState } from '@/components/ui/error-state';

export function RecentTransactions() {
  const formatCurrency = useFormatCurrency();
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsRecent({
    limit: 5,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategories();

  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return 'その他';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'その他';
  };

  const isLoading = transactionsLoading || categoriesLoading;
  const hasError = transactionsError || categoriesError;

  if (hasError) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">最近の取引</CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkErrorState
            onRetry={() => {
              refetchTransactions();
              refetchCategories();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">最近の取引</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse bg-muted rounded-full w-8 h-8" />
                <div className="space-y-1">
                  <div className="animate-pulse bg-muted rounded h-4 w-16" />
                  <div className="animate-pulse bg-muted rounded h-3 w-12" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="animate-pulse bg-muted rounded h-4 w-20" />
                <div className="animate-pulse bg-muted rounded h-3 w-16" />
              </div>
            </div>
          ))}
          <div className="animate-pulse bg-muted rounded h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">最近の取引</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">まだ取引がありません</p>
            <Button asChild>
              <Link href="/transactions/new">最初の取引を追加</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">最近の取引</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === TransactionType.income
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {transaction.type === TransactionType.income ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{getCategoryName(transaction.categoryId)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(transaction.transDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-medium ${
                  transaction.type === TransactionType.income ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === TransactionType.income ? '+' : '-'}
                {formatCurrency(transaction.amount || 0)}
              </p>
              {transaction.memo && (
                <p className="text-xs text-muted-foreground truncate max-w-24">
                  {transaction.memo}
                </p>
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full" asChild>
          <Link href="/transactions">
            全ての取引を表示
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
