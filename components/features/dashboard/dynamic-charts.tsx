'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart } from 'lucide-react';

// チャートコンポーネントの動的インポート（ローディング状態付き）
const MonthlyExpenseChart = dynamic(
  () => import('./monthly-expense-chart').then((mod) => ({ default: mod.MonthlyExpenseChart })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            今月の支出内訳
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">チャートを読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

const MonthlyTrendChart = dynamic(
  () => import('./monthly-trend-chart').then((mod) => ({ default: mod.MonthlyTrendChart })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            月別推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">チャートを読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

export { MonthlyExpenseChart, MonthlyTrendChart };
