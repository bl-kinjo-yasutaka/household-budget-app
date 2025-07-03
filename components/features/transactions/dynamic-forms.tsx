'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Transaction, Category } from '@/src/api/generated/model';

// 取引フォームコンポーネントの動的インポート（ローディング状態付き）
const TransactionFormTabs = dynamic(
  () => import('./transaction-form-tabs').then((mod) => ({ default: mod.TransactionFormTabs })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">取引フォーム</h1>
            <p className="text-muted-foreground">取引情報を入力・編集します</p>
          </div>
        </div>

        {/* Loading Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">取引情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Loading skeleton for form fields */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-muted rounded flex-1"></div>
                  <div className="h-10 bg-muted rounded flex-1"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-12"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>

              {/* Loading action buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <div className="h-10 bg-muted rounded w-24"></div>
                <div className="h-10 bg-primary/20 rounded w-20 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">読み込み中...</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
    ssr: false,
  }
);

// 型定義をエクスポート用に再定義
interface TransactionFormTabsProps {
  transaction?: Transaction;
  categories: Category[];
}

// 動的インポートコンポーネントの型付きラッパー
const DynamicTransactionFormTabs: React.FC<TransactionFormTabsProps> = (props) => (
  <TransactionFormTabs {...props} />
);

export { DynamicTransactionFormTabs as TransactionFormTabs };
