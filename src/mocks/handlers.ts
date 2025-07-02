import {
  getGetCategoriesMockHandler,
  getGetCategoriesIdMockHandler,
} from '@/src/api/generated/categories/categories.msw';
import {
  getGetTransactionsMockHandler,
  getGetTransactionsRecentMockHandler,
  getGetTransactionsIdMockHandler,
  getDeleteTransactionsIdMockHandler,
} from '@/src/api/generated/transactions/transactions.msw';
import {
  getGetUserSettingsMockHandler,
  getPutUserSettingsMockHandler,
} from '@/src/api/generated/user-settings/user-settings.msw';
import { getGetUserMeMockHandler } from '@/src/api/generated/users/users.msw';
import type { Transaction, Category } from '@/src/api/generated/model';
import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import {
  transactionFormSchema,
  categoryFormSchema,
  loginSchema,
  signupSchema,
} from '@/src/lib/schemas';

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

// カスタムハンドラー（バリデーション付き）
const createTransactionHandler = http.post('*/transactions', async (info) => {
  try {
    const requestBody = await info.request.json();
    const validatedData = transactionFormSchema.parse(requestBody);

    // カテゴリ存在チェック
    const categoryExists = mockCategories.some((cat) => cat.id === validatedData.categoryId);
    if (!categoryExists) {
      return HttpResponse.json({ error: '指定されたカテゴリが存在しません' }, { status: 400 });
    }

    // 新しい取引を作成
    const newTransaction: Transaction = {
      id: mockTransactions.length + 1,
      userId: 1,
      categoryId: validatedData.categoryId,
      type: validatedData.type,
      transDate: validatedData.transDate,
      amount: validatedData.amount,
      memo: validatedData.memo || null,
      createdAt: new Date().toISOString(),
    };

    mockTransactions.push(newTransaction);

    console.log('POST /transactions 成功:', newTransaction);
    return HttpResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('POST /transactions バリデーションエラー:', error);

    if (error instanceof z.ZodError) {
      return HttpResponse.json(
        {
          error: '入力データにエラーがあります',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
});

const updateTransactionHandler = http.put('*/transactions/:id', async (info) => {
  const id = parseInt(info.params.id as string);

  if (isNaN(id) || id <= 0) {
    return HttpResponse.json({ error: '無効な取引IDです' }, { status: 400 });
  }

  const transactionIndex = mockTransactions.findIndex((t) => t.id === id);
  if (transactionIndex === -1) {
    return HttpResponse.json({ error: '取引が見つかりません' }, { status: 404 });
  }

  try {
    const requestBody = await info.request.json();
    const validatedData = transactionFormSchema.parse(requestBody);

    const categoryExists = mockCategories.some((cat) => cat.id === validatedData.categoryId);
    if (!categoryExists) {
      return HttpResponse.json({ error: '指定されたカテゴリが存在しません' }, { status: 400 });
    }

    const updatedTransaction: Transaction = {
      ...mockTransactions[transactionIndex],
      categoryId: validatedData.categoryId,
      type: validatedData.type,
      transDate: validatedData.transDate,
      amount: validatedData.amount,
      memo: validatedData.memo || null,
    };

    mockTransactions[transactionIndex] = updatedTransaction;

    console.log('PUT /transactions/' + id + ' 成功:', updatedTransaction);
    return HttpResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error('PUT /transactions/' + id + ' バリデーションエラー:', error);

    if (error instanceof z.ZodError) {
      return HttpResponse.json(
        {
          error: '入力データにエラーがあります',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
});

// 自動生成されたハンドラー
export const handlers = [
  // Auth handlers (with validation)
  http.post('*/auth/signup', async (info) => {
    try {
      const requestBody = await info.request.json();
      const validatedData = signupSchema.parse(requestBody);

      const newUser = {
        id: 1,
        email: validatedData.email,
        name: validatedData.name,
        createdAt: new Date().toISOString(),
      };

      console.log('POST /auth/signup 成功:', newUser);
      return HttpResponse.json(
        {
          token: 'demo-jwt-token-signup-' + Date.now(),
          user: newUser,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('POST /auth/signup バリデーションエラー:', error);

      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          {
            error: '入力データにエラーがあります',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
    }
  }),
  http.post('*/auth/login', async (info) => {
    try {
      const requestBody = await info.request.json();
      const validatedData = loginSchema.parse(requestBody);

      // デモ用の簡単な認証チェック
      if (validatedData.email !== 'demo@example.com' || validatedData.password !== 'password123') {
        return HttpResponse.json(
          { error: 'メールアドレスまたはパスワードが正しくありません' },
          { status: 401 }
        );
      }

      const user = {
        id: 1,
        email: 'demo@example.com',
        name: 'デモユーザー',
        createdAt: new Date().toISOString(),
      };

      console.log('POST /auth/login 成功:', user);
      return HttpResponse.json(
        {
          token: 'demo-jwt-token-12345',
          user: user,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('POST /auth/login バリデーションエラー:', error);

      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          {
            error: '入力データにエラーがあります',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
    }
  }),

  // Categories handlers
  getGetCategoriesMockHandler(mockCategories),
  http.post('*/categories', async (info) => {
    try {
      const requestBody = await info.request.json();
      const validatedData = categoryFormSchema.parse(requestBody);

      // 同じ名前のカテゴリが存在しないかチェック
      const nameExists = mockCategories.some(
        (cat) => cat.name === validatedData.name && cat.type === validatedData.type
      );
      if (nameExists) {
        return HttpResponse.json({ error: '同じ名前のカテゴリが既に存在します' }, { status: 409 });
      }

      // 新しいカテゴリを作成
      const newCategory: Category = {
        id: mockCategories.length + 1,
        userId: 1,
        name: validatedData.name,
        colorHex: validatedData.colorHex,
        type: validatedData.type,
        createdAt: new Date().toISOString(),
      };

      mockCategories.push(newCategory);

      console.log('POST /categories 成功:', newCategory);
      return HttpResponse.json(newCategory, { status: 201 });
    } catch (error) {
      console.error('POST /categories バリデーションエラー:', error);

      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          {
            error: '入力データにエラーがあります',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
    }
  }),
  getGetCategoriesIdMockHandler(),
  // カテゴリ更新のカスタムハンドラー
  http.put('*/categories/:id', async (info) => {
    const id = parseInt(info.params.id as string);

    if (isNaN(id) || id <= 0) {
      return HttpResponse.json({ error: '無効なカテゴリIDです' }, { status: 400 });
    }

    const categoryIndex = mockCategories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) {
      return HttpResponse.json({ error: 'カテゴリが見つかりません' }, { status: 404 });
    }

    try {
      const requestBody = await info.request.json();
      const validatedData = categoryFormSchema.parse(requestBody);

      // 同じ名前のカテゴリが他に存在しないかチェック（自分以外）
      const nameExists = mockCategories.some(
        (cat) => cat.id !== id && cat.name === validatedData.name && cat.type === validatedData.type
      );
      if (nameExists) {
        return HttpResponse.json({ error: '同じ名前のカテゴリが既に存在します' }, { status: 409 });
      }

      const updatedCategory: Category = {
        ...mockCategories[categoryIndex],
        name: validatedData.name,
        colorHex: validatedData.colorHex,
        type: validatedData.type,
      };

      mockCategories[categoryIndex] = updatedCategory;

      console.log('PUT /categories/' + id + ' 成功:', updatedCategory);
      return HttpResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
      console.error('PUT /categories/' + id + ' バリデーションエラー:', error);

      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          {
            error: '入力データにエラーがあります',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
    }
  }),
  // カテゴリ削除のカスタムハンドラー
  http.delete('*/categories/:id', async (info) => {
    try {
      const id = parseInt(info.params.id as string);

      if (isNaN(id) || id <= 0) {
        return HttpResponse.json({ error: '無効なカテゴリIDです' }, { status: 400 });
      }

      const categoryIndex = mockCategories.findIndex((c) => c.id === id);
      if (categoryIndex === -1) {
        return HttpResponse.json({ error: 'カテゴリが見つかりません' }, { status: 404 });
      }

      // 関連する取引があるかチェック
      const hasTransactions = mockTransactions.some((t) => t.categoryId === id);
      if (hasTransactions) {
        return HttpResponse.json(
          { error: 'このカテゴリを使用している取引があるため削除できません' },
          { status: 409 }
        );
      }

      mockCategories.splice(categoryIndex, 1);

      console.log('DELETE /categories/' + id + ' 成功');
      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('DELETE /categories/' + info.params.id + ' エラー:', error);
      return HttpResponse.json({ error: 'カテゴリの削除に失敗しました' }, { status: 500 });
    }
  }),

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
    const memo = url.searchParams.get('memo');
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // 日付形式検証
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (from && !dateRegex.test(from)) {
      throw new Error('開始日の形式が正しくありません (YYYY-MM-DD)');
    }
    if (to && !dateRegex.test(to)) {
      throw new Error('終了日の形式が正しくありません (YYYY-MM-DD)');
    }

    // カテゴリID検証
    if (categoryId && isNaN(parseInt(categoryId))) {
      throw new Error('カテゴリIDは数値である必要があります');
    }

    // ページネーションパラメータ検証
    if (limit !== null) {
      // limitが指定されている場合のみ検証
      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new Error('取得件数は1〜100の範囲で指定してください');
      }
    }
    if (isNaN(offset) || offset < 0) {
      throw new Error('取得開始位置は0以上で指定してください');
    }

    // 日付範囲の論理チェック
    if (from && to && from > to) {
      throw new Error('開始日は終了日より前である必要があります');
    }

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

    // メモ検索（部分一致）
    if (memo) {
      const searchTerm = memo.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (t) => t.memo && t.memo.toLowerCase().includes(searchTerm)
      );
    }

    // 日付の降順でソート
    const sortedTransactions = filteredTransactions.sort((a, b) => {
      if (!a.transDate || !b.transDate) return 0;
      return b.transDate.localeCompare(a.transDate);
    });

    // 総件数
    const total = sortedTransactions.length;

    // ページネーション適用
    if (limit === null) {
      // limitが指定されていない場合は全件返す
      return {
        data: sortedTransactions,
        total,
        limit: total,
        offset: 0,
      };
    } else {
      // limitが指定されている場合はページネーション適用
      const paginatedTransactions = sortedTransactions.slice(offset, offset + limit);
      return {
        data: paginatedTransactions,
        total,
        limit,
        offset,
      };
    }
  }),
  // 最新取引エンドポイント
  getGetTransactionsRecentMockHandler((info) => {
    const url = new URL(info.request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');

    // limit検証
    if (isNaN(limit) || limit < 1 || limit > 20) {
      throw new Error('取得件数は1〜20の範囲で指定してください');
    }

    // 日付の降順でソート
    const sortedTransactions = [...mockTransactions].sort((a, b) => {
      if (!a.transDate || !b.transDate) return 0;
      return b.transDate.localeCompare(a.transDate);
    });

    // 指定件数取得
    return sortedTransactions.slice(0, limit);
  }),
  // カスタムハンドラーを使用
  createTransactionHandler,
  getGetTransactionsIdMockHandler((info) => {
    const url = new URL(info.request.url);
    const pathParts = url.pathname.split('/');
    const idString = pathParts[pathParts.length - 1];

    const id = parseInt(idString);

    // IDが数値でない場合
    if (isNaN(id) || id <= 0) {
      throw new Error('無効な取引IDです');
    }

    const transaction = mockTransactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error('取引が見つかりません');
    }

    return transaction;
  }),
  // カスタムハンドラーを使用
  updateTransactionHandler,
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
