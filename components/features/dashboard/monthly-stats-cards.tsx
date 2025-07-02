'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { TransactionType } from '@/src/api/generated/model';
import { formatCurrency } from '@/utils/format';
import { getCurrentMonthDateRange } from '@/utils/date';

export function MonthlyStatsCards() {
  const dateRange = useMemo(() => getCurrentMonthDateRange(), []);

  const { data: transactions = [], isLoading } = useGetTransactions({
    from: dateRange.from,
    to: dateRange.to,
  });

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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
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

      <Card>
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

      <Card className="md:col-span-2 lg:col-span-1">
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
