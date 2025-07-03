import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { MonthlyStatsCards } from '@/components/features/dashboard/monthly-stats-cards';
import { MonthlyExpenseChart, MonthlyTrendChart } from '@/components/features/dashboard';
import { RecentTransactions } from '@/components/features/dashboard/recent-transactions';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
          <p className="text-muted-foreground">今月の家計状況を確認しましょう</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="h-4 w-4" />
            収支を追加
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <MonthlyStatsCards />

      {/* Charts and Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <MonthlyExpenseChart />
          <MonthlyTrendChart />
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
}
