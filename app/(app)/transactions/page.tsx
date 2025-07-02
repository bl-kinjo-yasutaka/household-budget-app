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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // APIクエリパラメータを構築
  const queryParams = useMemo(() => {
    const params: GetTransactionsParams = {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (categoryId && categoryId !== 'all' && !isNaN(parseInt(categoryId))) {
      params.categoryId = parseInt(categoryId);
    }
    if (searchTerm) params.memo = searchTerm;
    return params;
  }, [fromDate, toDate, categoryId, searchTerm, currentPage]);

  const { data: transactionResponse, isLoading: isLoadingTransactions } =
    useGetTransactions(queryParams);

  const transactions = useMemo(() => transactionResponse?.data || [], [transactionResponse]);
  const totalTransactions = transactionResponse?.total || 0;

  const { data: categories = [] } = useGetCategories();

  // フィルター変更時にページを1リセット
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

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
        onFromDateChange={(value) => {
          setFromDate(value);
          handleFilterChange();
        }}
        onToDateChange={(value) => {
          setToDate(value);
          handleFilterChange();
        }}
        onCategoryChange={(value) => {
          setCategoryId(value);
          handleFilterChange();
        }}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          handleFilterChange();
        }}
        onClearFilters={() => {
          setFromDate('');
          setToDate('');
          setCategoryId('');
          setSearchTerm('');
          handleFilterChange();
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
          ) : transactions.length === 0 ? (
            <TransactionEmptyState
              hasFilters={Boolean(
                searchTerm || fromDate || toDate || (categoryId && categoryId !== 'all')
              )}
            />
          ) : (
            <TransactionsDataTable
              transactions={transactions}
              categories={categories}
              totalItems={totalTransactions}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
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
