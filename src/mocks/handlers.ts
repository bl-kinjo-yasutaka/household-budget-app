import {
  getPostAuthSignupMockHandler,
  getPostAuthLoginMockHandler,
} from '@/src/api/generated/auth/auth.msw';
import {
  getGetCategoriesMockHandler,
  getPostCategoriesMockHandler,
  getGetCategoriesIdMockHandler,
  getPutCategoriesIdMockHandler,
  getDeleteCategoriesIdMockHandler,
} from '@/src/api/generated/categories/categories.msw';
import {
  getGetTransactionsMockHandler,
  getPostTransactionsMockHandler,
  getGetTransactionsIdMockHandler,
  getPutTransactionsIdMockHandler,
  getDeleteTransactionsIdMockHandler,
} from '@/src/api/generated/transactions/transactions.msw';
import {
  getGetUserSettingsMockHandler,
  getPutUserSettingsMockHandler,
} from '@/src/api/generated/user-settings/user-settings.msw';
import { getGetUserMeMockHandler } from '@/src/api/generated/users/users.msw';
import type { Transaction, Category } from '@/src/api/generated/model';
import { http, HttpResponse } from 'msw';

// リアルなモックカテゴリデータ
export const mockCategories: Category[] = [
  {
    id: 1,
    userId: 1,
    name: '食費',
    colorHex: '#ef4444',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    name: '交通費',
    colorHex: '#3b82f6',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 3,
    userId: 1,
    name: '日用品',
    colorHex: '#f59e0b',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    name: '娯楽',
    colorHex: '#8b5cf6',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 5,
    userId: 1,
    name: '給料',
    colorHex: '#10b981',
    type: 'income',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 6,
    userId: 1,
    name: 'ボーナス',
    colorHex: '#059669',
    type: 'income',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 7,
    userId: 1,
    name: '光熱費',
    colorHex: '#6366f1',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 8,
    userId: 1,
    name: '医療費',
    colorHex: '#ec4899',
    type: 'expense',
    createdAt: '2025-06-01T00:00:00Z',
  },
];

// リアルなモック取引データ（正の値のみ）
export const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    categoryId: 5,
    type: 'income',
    transDate: '2025-06-25',
    amount: 250000,
    memo: '6月分給料',
    createdAt: '2025-06-25T09:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-24',
    amount: 3500,
    memo: '昼食（レストラン）',
    createdAt: '2025-06-24T12:30:00Z',
  },
  {
    id: 3,
    userId: 1,
    categoryId: 2,
    type: 'expense',
    transDate: '2025-06-24',
    amount: 1200,
    memo: '電車代',
    createdAt: '2025-06-24T08:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    categoryId: 3,
    type: 'expense',
    transDate: '2025-06-23',
    amount: 5800,
    memo: 'ティッシュ、洗剤など',
    createdAt: '2025-06-23T15:00:00Z',
  },
  {
    id: 5,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-23',
    amount: 2100,
    memo: 'スーパーで買い物',
    createdAt: '2025-06-23T18:00:00Z',
  },
  {
    id: 6,
    userId: 1,
    categoryId: 4,
    type: 'expense',
    transDate: '2025-06-22',
    amount: 4500,
    memo: '映画＋ポップコーン',
    createdAt: '2025-06-22T19:00:00Z',
  },
  {
    id: 7,
    userId: 1,
    categoryId: 7,
    type: 'expense',
    transDate: '2025-06-21',
    amount: 8500,
    memo: '電気代',
    createdAt: '2025-06-21T10:00:00Z',
  },
  {
    id: 8,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-20',
    amount: 1800,
    memo: 'コンビニ',
    createdAt: '2025-06-20T20:00:00Z',
  },
  {
    id: 9,
    userId: 1,
    categoryId: 2,
    type: 'expense',
    transDate: '2025-06-20',
    amount: 3000,
    memo: 'タクシー代',
    createdAt: '2025-06-20T23:00:00Z',
  },
  {
    id: 10,
    userId: 1,
    categoryId: 8,
    type: 'expense',
    transDate: '2025-06-19',
    amount: 2500,
    memo: '病院（風邪）',
    createdAt: '2025-06-19T14:00:00Z',
  },
  {
    id: 11,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-18',
    amount: 4200,
    memo: '夕食（外食）',
    createdAt: '2025-06-18T19:00:00Z',
  },
  {
    id: 12,
    userId: 1,
    categoryId: 3,
    type: 'expense',
    transDate: '2025-06-17',
    amount: 3200,
    memo: 'シャンプー、石鹸',
    createdAt: '2025-06-17T16:00:00Z',
  },
  {
    id: 13,
    userId: 1,
    categoryId: 4,
    type: 'expense',
    transDate: '2025-06-16',
    amount: 6000,
    memo: 'ゲームソフト',
    createdAt: '2025-06-16T13:00:00Z',
  },
  {
    id: 14,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-15',
    amount: 8900,
    memo: '週末の買い出し',
    createdAt: '2025-06-15T11:00:00Z',
  },
  {
    id: 15,
    userId: 1,
    categoryId: 6,
    type: 'income',
    transDate: '2025-06-15',
    amount: 100000,
    memo: '夏季ボーナス',
    createdAt: '2025-06-15T09:00:00Z',
  },
];

// 自動生成されたハンドラー
export const handlers = [
  // Auth handlers
  getPostAuthSignupMockHandler(),
  getPostAuthLoginMockHandler({
    token: 'demo-jwt-token-12345',
    user: {
      id: 1,
      email: 'demo@example.com',
      name: 'デモユーザー',
      createdAt: new Date().toISOString(),
    },
  }),

  // Categories handlers
  getGetCategoriesMockHandler(mockCategories),
  getPostCategoriesMockHandler(),
  getGetCategoriesIdMockHandler(),
  getPutCategoriesIdMockHandler(),
  getDeleteCategoriesIdMockHandler(),

  // Transactions handlers
  // Add explicit handler for /transactions/new to prevent it from matching :id pattern
  http.get('*/transactions/new', () => {
    return new HttpResponse(null, { status: 404 });
  }),
  getGetTransactionsMockHandler((info) => {
    // クエリパラメータを取得
    const url = new URL(info.request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const categoryId = url.searchParams.get('categoryId');

    let filteredTransactions = [...mockTransactions];

    // 日付フィルタリング
    if (from) {
      filteredTransactions = filteredTransactions.filter((t) => t.transDate && t.transDate >= from);
    }
    if (to) {
      filteredTransactions = filteredTransactions.filter((t) => t.transDate && t.transDate <= to);
    }

    // カテゴリフィルタリング
    if (categoryId) {
      const catId = parseInt(categoryId);
      filteredTransactions = filteredTransactions.filter((t) => t.categoryId === catId);
    }

    // 日付の降順でソート
    return filteredTransactions.sort((a, b) => {
      if (!a.transDate || !b.transDate) return 0;
      return b.transDate.localeCompare(a.transDate);
    });
  }),
  getPostTransactionsMockHandler((info) => {
    console.log('POST /transactions called', info.request);
    // 新しい取引を作成
    const newTransaction: Transaction = {
      id: mockTransactions.length + 1,
      userId: 1,
      categoryId: 1, // デフォルト値
      type: 'expense',
      transDate: new Date().toISOString().split('T')[0],
      amount: 1000,
      memo: '新しい取引',
      createdAt: new Date().toISOString(),
    };
    return newTransaction;
  }),
  getGetTransactionsIdMockHandler((info) => {
    const url = new URL(info.request.url);
    const pathParts = url.pathname.split('/');
    const idString = pathParts[pathParts.length - 1];

    const id = parseInt(idString);

    // If ID is not a number, it's not a valid transaction ID
    if (isNaN(id)) {
      // Return a dummy transaction that won't be used
      return { id: -1, userId: -1 } as Transaction;
    }

    const transaction = mockTransactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }),
  getPutTransactionsIdMockHandler(),
  getDeleteTransactionsIdMockHandler(),

  // Users handlers
  getGetUserMeMockHandler({
    id: 1,
    email: 'demo@example.com',
    name: 'デモユーザー',
    createdAt: '2025-06-01T00:00:00Z',
  }),

  // UserSettings handlers
  getGetUserSettingsMockHandler(),
  getPutUserSettingsMockHandler(),
];
