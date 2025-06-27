'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TransactionsDataTable } from '@/components/features/transactions/data-table';
import { TransactionFilters } from '@/components/features/transactions/transaction-filters';
import { TransactionEmptyState } from '@/components/features/transactions/transaction-empty-state';
import { useGetTransactions } from '@/src/api/generated/transactions/transactions';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { useState, useMemo } from 'react';
import type { GetTransactionsParams } from '@/src/api/generated/model';

export default function TransactionsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // APIクエリパラメータを構築
  const queryParams = useMemo(() => {
    const params: GetTransactionsParams = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (categoryId && categoryId !== 'all' && !isNaN(parseInt(categoryId))) {
      params.categoryId = parseInt(categoryId);
    }
    return params;
  }, [fromDate, toDate, categoryId]);

  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactions(queryParams);

  const { data: categories = [] } = useGetCategories();

  const filteredTransactions = useMemo(() => {
    // メモ検索のみクライアントサイドで実行（APIがメモ検索をサポートしていない場合）
    if (!searchTerm) return transactions;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return transactions.filter(
      (transaction) => transaction.memo?.toLowerCase().includes(lowerSearchTerm) || false
    );
  }, [transactions, searchTerm]);

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
      <TransactionFilters
        fromDate={fromDate}
        toDate={toDate}
        categoryId={categoryId}
        searchTerm={searchTerm}
        categories={categories}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onCategoryChange={setCategoryId}
        onSearchTermChange={setSearchTerm}
        onClearFilters={() => {
          setFromDate('');
          setToDate('');
          setCategoryId('');
          setSearchTerm('');
        }}
      />

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
            <TransactionEmptyState
              hasFilters={Boolean(
                searchTerm || fromDate || toDate || (categoryId && categoryId !== 'all')
              )}
            />
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
