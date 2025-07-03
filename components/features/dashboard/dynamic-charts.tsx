'use client';

import dynamic from 'next/dynamic';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

// チャートコンポーネントの動的インポート（ローディング状態付き）
const MonthlyExpenseChart = dynamic(
  () => import('./monthly-expense-chart').then((mod) => ({ default: mod.MonthlyExpenseChart })),
  {
    loading: () => <LoadingIndicator variant="chart" />,
    ssr: false,
  }
);

const MonthlyTrendChart = dynamic(
  () => import('./monthly-trend-chart').then((mod) => ({ default: mod.MonthlyTrendChart })),
  {
    loading: () => <LoadingIndicator variant="chart" />,
    ssr: false,
  }
);

export { MonthlyExpenseChart, MonthlyTrendChart };
