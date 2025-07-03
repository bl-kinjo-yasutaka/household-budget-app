'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import type { Transaction, Category } from '@/src/api/generated/model';

// 型定義をエクスポート用に再定義
interface TransactionFormTabsProps {
  transaction?: Transaction;
  categories: Category[];
}

// 取引フォームコンポーネントの動的インポート（ローディング状態付き）
const TransactionFormTabs = dynamic(
  () => import('./transaction-form-tabs').then((mod) => ({ default: mod.TransactionFormTabs })),
  {
    loading: () => <LoadingIndicator variant="form-skeleton" count={4} />,
    ssr: false,
  }
);

// 動的インポートコンポーネントの型付きラッパー
const DynamicTransactionFormTabs: React.FC<TransactionFormTabsProps> = (props) => (
  <TransactionFormTabs {...props} />
);

export { DynamicTransactionFormTabs as TransactionFormTabs };
