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

// リアルなモック取引データ（正の値のみ）- 7月データ
export const mockTransactions: Transaction[] = [
  // 7月の収入
  {
    id: 1,
    userId: 1,
    categoryId: 5,
    type: 'income',
    transDate: '2025-07-25',
    amount: 280000,
    memo: '7月分給料',
    createdAt: '2025-07-25T09:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    categoryId: 6,
    type: 'income',
    transDate: '2025-07-10',
    amount: 50000,
    memo: '副業収入',
    createdAt: '2025-07-10T09:00:00Z',
  },

  // 7月の支出 - 食費
  {
    id: 3,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-07-30',
    amount: 3800,
    memo: '夏野菜を購入',
    createdAt: '2025-07-30T18:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-07-29',
    amount: 2500,
    memo: 'ランチ（そうめん）',
    createdAt: '2025-07-29T12:30:00Z',
  },
  {
    id: 5,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-07-28',
    amount: 4200,
    memo: '焼肉ディナー',
    createdAt: '2025-07-28T19:00:00Z',
  },
  {
    id: 6,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-07-25',
    amount: 6800,
    memo: '週末の食材買い出し',
    createdAt: '2025-07-25T11:00:00Z',
  },
  {
    id: 7,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-07-20',
    amount: 1800,
    memo: 'コンビニ（アイス）',
    createdAt: '2025-07-20T15:00:00Z',
  },

  // 7月の支出 - 交通費
  {
    id: 8,
    userId: 1,
    categoryId: 2,
    type: 'expense',
    transDate: '2025-07-28',
    amount: 2400,
    memo: '電車代（往復）',
    createdAt: '2025-07-28T08:00:00Z',
  },
  {
    id: 9,
    userId: 1,
    categoryId: 2,
    type: 'expense',
    transDate: '2025-07-22',
    amount: 5200,
    memo: 'タクシー（深夜）',
    createdAt: '2025-07-22T23:30:00Z',
  },

  // 7月の支出 - 日用品
  {
    id: 10,
    userId: 1,
    categoryId: 3,
    type: 'expense',
    transDate: '2025-07-26',
    amount: 4500,
    memo: '夏用洗剤、虫除けスプレー',
    createdAt: '2025-07-26T16:00:00Z',
  },
  {
    id: 11,
    userId: 1,
    categoryId: 3,
    type: 'expense',
    transDate: '2025-07-15',
    amount: 3200,
    memo: 'シャンプー、ボディソープ',
    createdAt: '2025-07-15T14:00:00Z',
  },

  // 7月の支出 - 娯楽
  {
    id: 12,
    userId: 1,
    categoryId: 4,
    type: 'expense',
    transDate: '2025-07-27',
    amount: 8000,
    memo: '夏祭り（屋台）',
    createdAt: '2025-07-27T19:00:00Z',
  },
  {
    id: 13,
    userId: 1,
    categoryId: 4,
    type: 'expense',
    transDate: '2025-07-21',
    amount: 3500,
    memo: '映画鑑賞',
    createdAt: '2025-07-21T15:00:00Z',
  },
  {
    id: 14,
    userId: 1,
    categoryId: 4,
    type: 'expense',
    transDate: '2025-07-14',
    amount: 12000,
    memo: 'カラオケ＋飲み会',
    createdAt: '2025-07-14T21:00:00Z',
  },

  // 7月の支出 - 光熱費
  {
    id: 15,
    userId: 1,
    categoryId: 7,
    type: 'expense',
    transDate: '2025-07-25',
    amount: 12500,
    memo: '電気代（エアコン使用増）',
    createdAt: '2025-07-25T10:00:00Z',
  },
  {
    id: 16,
    userId: 1,
    categoryId: 7,
    type: 'expense',
    transDate: '2025-07-20',
    amount: 4200,
    memo: 'ガス代',
    createdAt: '2025-07-20T10:00:00Z',
  },

  // 7月の支出 - 医療費
  {
    id: 17,
    userId: 1,
    categoryId: 8,
    type: 'expense',
    transDate: '2025-07-18',
    amount: 3500,
    memo: '熱中症予防の薬',
    createdAt: '2025-07-18T11:00:00Z',
  },

  // 6月データも少し残す（月別推移用）
  {
    id: 18,
    userId: 1,
    categoryId: 5,
    type: 'income',
    transDate: '2025-06-25',
    amount: 250000,
    memo: '6月分給料',
    createdAt: '2025-06-25T09:00:00Z',
  },
  {
    id: 19,
    userId: 1,
    categoryId: 1,
    type: 'expense',
    transDate: '2025-06-20',
    amount: 45000,
    memo: '6月の食費合計',
    createdAt: '2025-06-20T18:00:00Z',
  },
  {
    id: 20,
    userId: 1,
    categoryId: 7,
    type: 'expense',
    transDate: '2025-06-15',
    amount: 8500,
    memo: '6月の電気代',
    createdAt: '2025-06-15T10:00:00Z',
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
