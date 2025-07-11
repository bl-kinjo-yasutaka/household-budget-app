'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { TransactionType } from '@/src/api/generated/model';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { getCurrentMonthDateRange } from '@/utils/date';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { NetworkErrorState } from '@/components/ui/error-state';

// チャートで使用するデフォルトカラーパレット
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

/**
 * 月別支出内訳円グラフコンポーネント
 *
 * @description
 * 当月の支出をカテゴリ別に円グラフで表示する。
 * カテゴリごとの支出比率を視覚的に把握するために使用。
 * レスポンシブ対応とアクセシビリティを考慮した実装。
 */
export function MonthlyExpenseChart() {
  const formatCurrency = useFormatCurrency();
  // 当月の日付範囲を取得（月が変わっても自動的に更新される）
  const dateRange = useMemo(() => getCurrentMonthDateRange(), []);

  const {
    data: transactionResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactions({
    from: dateRange.from,
    to: dateRange.to,
    // 全件取得してクライアントサイドでカテゴリ集計
  });

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategories();

  // カテゴリ別支出データの集計
  const categoryData = useMemo(() => {
    // 支出取引のみを対象にカテゴリ別集計
    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.expense) {
          acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + transaction.amount;
        }
        return acc;
      },
      {} as Record<number, number>
    );

    // カテゴリ情報と集計結果をマージし、金額が0より大きいもののみ表示
    return categories
      .map((category) => ({
        name: category.name,
        value: categoryTotals[category.id ?? 0] ?? 0,
        color: category.colorHex,
      }))
      .filter((item) => item.value > 0);
  }, [transactions, categories]);

  // カスタムツールチップコンポーネント
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; [key: string]: unknown }>;
  }) => {
    if (active && payload?.length) {
      const firstPayload = payload[0];
      if (firstPayload && 'name' in firstPayload && 'value' in firstPayload) {
        return (
          <div className="bg-background border rounded-lg p-2 shadow-lg">
            <p className="font-medium">{firstPayload.name}</p>
            <p className="text-primary">{formatCurrency(firstPayload.value)}</p>
          </div>
        );
      }
    }
    return null;
  };

  const hasError = transactionsError || categoriesError;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">支出内訳</CardTitle>
      </CardHeader>
      <CardContent>
        {transactionsLoading || categoriesLoading ? (
          <LoadingIndicator variant="chart" />
        ) : hasError ? (
          <NetworkErrorState
            onRetry={() => {
              refetchTransactions();
              refetchCategories();
            }}
          />
        ) : categoryData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">今月の支出データがありません</p>
          </div>
        ) : (
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
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
