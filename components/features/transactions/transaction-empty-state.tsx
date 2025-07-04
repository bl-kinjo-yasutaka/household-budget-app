'use client';

import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface TransactionEmptyStateProps {
  hasFilters: boolean;
}

export function TransactionEmptyState({ hasFilters }: TransactionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {hasFilters ? '条件に一致する取引がありません' : 'まだ取引がありません'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {hasFilters ? '検索条件を変更してください' : '最初の収支記録を追加してみましょう'}
      </p>
      {!hasFilters && (
        <Button asChild>
          <Link href="/transactions/new">取引を追加</Link>
        </Button>
      )}
    </div>
  );
}
