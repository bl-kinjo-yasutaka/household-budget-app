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
import { Pagination } from '@/components/ui/pagination';
import type { Transaction, Category } from '@/src/api/generated/model';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/format';

interface DataTableProps {
  transactions: Transaction[];
  categories: Category[];
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete?: (id: number) => void;
  itemsPerPage?: number;
}

export function TransactionsDataTable({
  transactions,
  categories,
  totalItems,
  currentPage,
  onPageChange,
  onDelete,
  itemsPerPage = 10,
}: DataTableProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getCategoryById = (categoryId: number | null | undefined) => {
    if (!categoryId) return null;
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden">
        <Table aria-label="取引一覧テーブル">
          <caption className="sr-only">
            取引履歴の一覧。日付、カテゴリ、金額、メモ、操作ボタンが含まれています。
          </caption>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="py-4 px-6" scope="col">
                日付
              </TableHead>
              <TableHead className="py-4 px-6" scope="col">
                カテゴリ
              </TableHead>
              <TableHead className="py-4 px-6 text-right" scope="col">
                金額
              </TableHead>
              <TableHead className="py-4 px-6" scope="col">
                メモ
              </TableHead>
              <TableHead className="py-4 px-6 text-right" scope="col">
                操作
              </TableHead>
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
              transactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId);
                const isIncome = transaction.type === 'income';

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
                      {isIncome ? '+' : '-'}
                      {formatCurrency(transaction.amount || 0)}
                    </TableCell>
                    <TableCell className="py-4 px-6 max-w-[200px] truncate">
                      {transaction.memo || '-'}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/transactions/${transaction.id}/edit`}
                            aria-label={`${formatDate(transaction.transDate)}の取引を編集`}
                          >
                            <Edit className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">編集</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => transaction.id && onDelete?.(transaction.id)}
                          disabled={!transaction.id}
                          aria-label={`${formatDate(transaction.transDate)}の取引を削除`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        showItemsRange={true}
        size="compact"
        density="full"
        className="md:px-6 px-4"
      />
    </div>
  );
}
