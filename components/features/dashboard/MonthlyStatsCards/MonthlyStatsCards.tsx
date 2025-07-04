'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { TransactionType } from '@/src/api/generated/model';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { getCurrentMonthDateRange } from '@/utils/date';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { NetworkErrorState } from '@/components/ui/ErrorState';

export function MonthlyStatsCards() {
  const formatCurrency = useFormatCurrency();

  const dateRange = getCurrentMonthDateRange();

  const {
    data: transactionResponse,
    isLoading,
    error,
    refetch,
  } = useGetTransactions({
    from: dateRange.from,
    to: dateRange.to,
    // limitを省略して全件取得
  });

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);

  const monthlyStats = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount || 0;
        if (transaction.type === TransactionType.income) {
          acc.income += amount;
          acc.incomeCount += 1;
        } else if (transaction.type === TransactionType.expense) {
          acc.expense += amount;
          acc.expenseCount += 1;
        }
        return acc;
      },
      { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 }
    );
  }, [transactions]);

  const balance = monthlyStats.income - monthlyStats.expense;

  const showLoading = useDelayedLoading(isLoading, 150);

  if (error) {
    return <NetworkErrorState onRetry={() => refetch()} />;
  }

  if (showLoading) {
    return <LoadingIndicator variant="stats-skeleton" count={3} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card data-testid="income-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の収入</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(monthlyStats.income)}
          </div>
          <p className="text-xs text-muted-foreground">{monthlyStats.incomeCount} 件の収入</p>
        </CardContent>
      </Card>

      <Card data-testid="expense-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の支出</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(monthlyStats.expense)}
          </div>
          <p className="text-xs text-muted-foreground">{monthlyStats.expenseCount} 件の支出</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1" data-testid="balance-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">今月の残高</CardTitle>
          <Wallet className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${balance >= 0 ? 'text-chart-2' : 'text-destructive'}`}
          >
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground">{balance >= 0 ? '黒字' : '赤字'}です</p>
        </CardContent>
      </Card>
    </div>
  );
}
