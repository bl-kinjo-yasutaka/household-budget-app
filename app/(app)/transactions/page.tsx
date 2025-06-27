'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Calendar } from 'lucide-react';
import Link from 'next/link';
import { TransactionsDataTable } from '@/components/features/transactions/data-table';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TransactionsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions = [], isLoading: isLoadingTransactions } = useGetTransactions({
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
    ...(categoryId && categoryId !== 'all' && { categoryId: parseInt(categoryId) }),
  });

  const { data: categories = [] } = useGetCategories();

  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return transaction.memo?.toLowerCase().includes(lowerSearchTerm) || false;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">フィルター・検索</CardTitle>
            {(fromDate || toDate || (categoryId && categoryId !== 'all') || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setCategoryId('');
                  setSearchTerm('');
                }}
              >
                フィルターをクリア
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">メモ検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="取引メモで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">開始日</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">終了日</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">カテゴリ</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id?.toString() || ''}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.colorHex }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">取引一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || fromDate || toDate || (categoryId && categoryId !== 'all')
                  ? '条件に一致する取引がありません'
                  : 'まだ取引がありません'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || fromDate || toDate || (categoryId && categoryId !== 'all')
                  ? '検索条件を変更してください'
                  : '最初の収支記録を追加してみましょう'}
              </p>
              {!searchTerm && !fromDate && !toDate && (!categoryId || categoryId === 'all') && (
                <Button asChild>
                  <Link href="/transactions/new">取引を追加</Link>
                </Button>
              )}
            </div>
          ) : (
            <TransactionsDataTable
              transactions={filteredTransactions}
              categories={categories}
              onDelete={(id) => {
                console.log('Delete transaction:', id);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
