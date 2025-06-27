'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Transaction, Category } from '@/src/api/generated/model';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';

interface DataTableProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete?: (id: number) => void;
  itemsPerPage?: number;
}

export function TransactionsDataTable({
  transactions,
  categories,
  onDelete,
  itemsPerPage = 10,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const getCategoryById = (categoryId: number | null | undefined) => {
    if (!categoryId) return null;
    return categories.find((cat) => cat.id === categoryId);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="py-4 px-6">日付</TableHead>
              <TableHead className="py-4 px-6">カテゴリ</TableHead>
              <TableHead className="py-4 px-6 text-right">金額</TableHead>
              <TableHead className="py-4 px-6">メモ</TableHead>
              <TableHead className="py-4 px-6 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center py-8">
                  取引データがありません
                </TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId);
                const isIncome = parseFloat(transaction.amount || '0') > 0;

                return (
                  <TableRow key={transaction.id} className="border-b hover:bg-muted/50">
                    <TableCell className="font-medium py-4 px-6">
                      {formatDate(transaction.transDate)}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      {category ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.colorHex }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell
                      className={`py-4 px-6 text-right font-medium ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isIncome ? '+' : ''}
                      {formatCurrency(transaction.amount || '0')}
                    </TableCell>
                    <TableCell className="py-4 px-6 max-w-[200px] truncate">
                      {transaction.memo || '-'}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/transactions/${transaction.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">編集</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(transaction.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">削除</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/25">
          <div className="text-sm text-muted-foreground">
            {transactions.length} 件中 {startIndex + 1} - {Math.min(endIndex, transactions.length)}{' '}
            件を表示
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              前へ
            </Button>
            <div className="text-sm px-3 py-1 bg-background rounded border">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              次へ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
