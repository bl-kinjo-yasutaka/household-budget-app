import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">取引履歴</h1>
          <p className="text-muted-foreground">すべての収支記録を管理</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="h-4 w-4" />
            新しい取引
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">フィルター・検索</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="取引を検索..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              フィルター
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">取引一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">まだ取引がありません</h3>
            <p className="mb-4">最初の収支記録を追加してみましょう</p>
            <Button asChild>
              <Link href="/transactions/new">取引を追加</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
