'use client';

import { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { TransactionType } from '@/src/api/generated/model';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { getYearDateRange } from '@/utils/date';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// 1年分の月配列（1-12月）
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * 月別収支推移棒グラフコンポーネント
 *
 * @description
 * 当年の月別収入・支出推移を棒グラフで表示する。
 * 収支のトレンドを把握し、家計管理の改善点を見つけるために使用。
 * Y軸は大きな金額を見やすくするため「k」表記を採用。
 */
export function MonthlyTrendChart() {
  const formatCurrency = useFormatCurrency();
  // 当年の日付範囲を取得（年が変わっても自動的に更新される）
  const yearDateRange = useMemo(() => getYearDateRange(), []);

  // Rechartsツールチップ用フォーマッター（パフォーマンス最適化のためメモ化）
  const tooltipFormatter = useCallback(
    (value: number, name: string) => {
      return [formatCurrency(value), name];
    },
    [formatCurrency]
  );

  // Y軸フォーマッター（大きな金額を「k」単位で表示）
  const yAxisFormatter = useCallback(
    (value: number) => {
      const formatted = formatCurrency(value);
      // 通貨記号を抽出（例：¥、$、€）
      const currencySymbol = formatted.match(/^[^\d\s]+/)?.[0] || '¥';
      return `${currencySymbol}${(value / 1000).toFixed(0)}k`;
    },
    [formatCurrency]
  );

  const { data: transactionResponse, isLoading } = useGetTransactions({
    from: yearDateRange.from,
    to: yearDateRange.to,
    // 全件取得して月別集計を実行
  });

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);

  // 月別データの集計処理
  const monthlyData = useMemo(() => {
    // 月ごとの収入・支出を集計
    const monthlyTotals = transactions.reduce(
      (acc, transaction) => {
        const transDate = new Date(transaction.transDate || '');
        const month = transDate.getMonth() + 1;
        const year = transDate.getFullYear();

        // 対象年のデータのみ集計
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

    // 1-12月の全てのデータを生成（データがない月は0で表示）
    return MONTHS.map((month) => ({
      month: `${month}月`,
      収入: monthlyTotals[month]?.income || 0,
      支出: monthlyTotals[month]?.expense || 0,
      残高: (monthlyTotals[month]?.income || 0) - (monthlyTotals[month]?.expense || 0),
    }));
  }, [transactions, yearDateRange.year]);

  if (isLoading) {
    return <LoadingSkeleton variant="chart" />;
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
