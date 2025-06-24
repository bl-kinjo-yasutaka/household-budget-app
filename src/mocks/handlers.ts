import { HttpResponse, http } from 'msw';
import { 
  getPostAuthSignupMockHandler,
  getPostAuthLoginMockHandler
} from '@/src/api/generated/auth/auth.msw';
import {
  getGetCategoriesMockHandler,
  getPostCategoriesMockHandler,
  getGetCategoriesIdMockHandler,
  getPutCategoriesIdMockHandler,
  getDeleteCategoriesIdMockHandler
} from '@/src/api/generated/categories/categories.msw';
import {
  getGetTransactionsMockHandler,
  getPostTransactionsMockHandler,
  getGetTransactionsIdMockHandler,
  getPutTransactionsIdMockHandler,
  getDeleteTransactionsIdMockHandler
} from '@/src/api/generated/transactions/transactions.msw';
import {
  getGetUserSettingsMockHandler,
  getPutUserSettingsMockHandler
} from '@/src/api/generated/user-settings/user-settings.msw';

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
      createdAt: new Date().toISOString()
    }
  }),
  
  // Categories handlers
  getGetCategoriesMockHandler(),
  getPostCategoriesMockHandler(),
  getGetCategoriesIdMockHandler(),
  getPutCategoriesIdMockHandler(),
  getDeleteCategoriesIdMockHandler(),
  
  // Transactions handlers
  getGetTransactionsMockHandler(),
  getPostTransactionsMockHandler(),
  getGetTransactionsIdMockHandler(),
  getPutTransactionsIdMockHandler(),
  getDeleteTransactionsIdMockHandler(),
  
  // UserSettings handlers
  getGetUserSettingsMockHandler(),
  getPutUserSettingsMockHandler(),
];