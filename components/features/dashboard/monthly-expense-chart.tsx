'use client';

import { useMemo } from 'react';
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
import { formatCurrency } from '@/utils/format';
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
  const dateRange = useMemo(() => getCurrentMonthDateRange(), []);

  const { data: transactions = [], isLoading: transactionsLoading } = useGetTransactions({
    from: dateRange.from,
    to: dateRange.to,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.type === TransactionType.expense);

    const data = categories
      .map((category) => {
        const categoryTransactions = expenseTransactions.filter(
          (t) => t.categoryId === category.id
        );
        const totalAmount = categoryTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
          name: category.name || 'その他',
          value: totalAmount,
          color: category.colorHex || '#8884D8',
        };
      })
      .filter((item) => item.value > 0);

    const uncategorizedAmount = expenseTransactions
      .filter((t) => !t.categoryId)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    if (uncategorizedAmount > 0) {
      data.push({
        name: 'その他',
        value: uncategorizedAmount,
        color: '#9CA3AF',
      });
    }

    return data;
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
  const yearDateRange = useMemo(() => getYearDateRange(), []);

  const { data: transactions = [], isLoading } = useGetTransactions({
    from: yearDateRange.from,
    to: yearDateRange.to,
  });

  const monthlyData = useMemo(() => {
    return MONTHS.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transDate = new Date(t.transDate || '');
        return transDate.getMonth() + 1 === month && transDate.getFullYear() === yearDateRange.year;
      });

      const income = monthTransactions
        .filter((t) => t.type === TransactionType.income)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const expense = monthTransactions
        .filter((t) => t.type === TransactionType.expense)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      return {
        month: `${month}月`,
        収入: income,
        支出: expense,
        残高: income - expense,
      };
    });
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
              <YAxis tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
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
