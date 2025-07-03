'use client';

import { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { TransactionType } from '@/src/api/generated/model';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { getCurrentMonthDateRange, getYearDateRange } from '@/utils/date';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function MonthlyExpenseChart() {
  const formatCurrency = useFormatCurrency();
  const dateRange = useMemo(() => getCurrentMonthDateRange(), []);

  const { data: transactionResponse, isLoading: transactionsLoading } = useGetTransactions({
    from: dateRange.from,
    to: dateRange.to,
    // limitを省略して全件取得
  });

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  const categoryData = useMemo(() => {
    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.expense) {
          acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + transaction.amount;
        }
        return acc;
      },
      {} as Record<number, number>
    );

    return categories
      .map((category) => ({
        name: category.name,
        value: categoryTotals[category.id] || 0,
        color: category.colorHex,
      }))
      .filter((item) => item.value > 0);
  }, [transactions, categories]);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (transactionsLoading || categoriesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">支出内訳</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">支出内訳</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">今月の支出データがありません</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">支出内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart role="img" aria-label="カテゴリ別支出内訳円グラフ">
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonthlyTrendChart() {
  const formatCurrency = useFormatCurrency();
  const yearDateRange = useMemo(() => getYearDateRange(), []);

  // Recharts用のformatter関数をメモ化
  const tooltipFormatter = useCallback(
    (value: number, name: string) => {
      return [formatCurrency(value), name];
    },
    [formatCurrency]
  );

  // Y軸のフォーマッター（通貨記号を動的に設定）
  const yAxisFormatter = useCallback(
    (value: number) => {
      const formatted = formatCurrency(value);
      // 通貨記号を抽出して短縮表示用に使用
      const currencySymbol = formatted.match(/^[^\d\s]+/)?.[0] || '¥';
      return `${currencySymbol}${(value / 1000).toFixed(0)}k`;
    },
    [formatCurrency]
  );

  const { data: transactionResponse, isLoading } = useGetTransactions({
    from: yearDateRange.from,
    to: yearDateRange.to,
    // limitを省略して全件取得
  });

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);

  const monthlyData = useMemo(() => {
    const monthlyTotals = transactions.reduce(
      (acc, transaction) => {
        const transDate = new Date(transaction.transDate || '');
        const month = transDate.getMonth() + 1;
        const year = transDate.getFullYear();

        if (year === yearDateRange.year) {
          if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
          }

          const amount = transaction.amount || 0;
          if (transaction.type === TransactionType.income) {
            acc[month].income += amount;
          } else if (transaction.type === TransactionType.expense) {
            acc[month].expense += amount;
          }
        }

        return acc;
      },
      {} as Record<number, { income: number; expense: number }>
    );

    return MONTHS.map((month) => ({
      month: `${month}月`,
      収入: monthlyTotals[month]?.income || 0,
      支出: monthlyTotals[month]?.expense || 0,
      残高: (monthlyTotals[month]?.income || 0) - (monthlyTotals[month]?.expense || 0),
    }));
  }, [transactions, yearDateRange.year]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">月別推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">月別推移</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} role="img" aria-label="月別収支推移棒グラフ">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={yAxisFormatter} />
              <Tooltip
                formatter={tooltipFormatter}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="収入" fill="#059669" />
              <Bar dataKey="支出" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
