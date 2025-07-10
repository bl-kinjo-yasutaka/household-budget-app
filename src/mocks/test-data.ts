import { faker } from '@faker-js/faker';
import { CategoryType, TransactionType } from '@/src/api/generated/model';
import type { Category, Transaction, User } from '@/src/api/generated/model';

// テスト用のデフォルトユーザー
export const defaultTestUser: User = {
  id: 1,
  name: 'テスト太郎',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
};

// テスト用のデフォルトカテゴリ
export const defaultTestCategories: Category[] = [
  {
    id: 1,
    name: '食費',
    type: CategoryType.expense,
    colorHex: '#dc2626',
    userId: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '給与',
    type: CategoryType.income,
    colorHex: '#059669',
    userId: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: '交通費',
    type: CategoryType.expense,
    colorHex: '#ea580c',
    userId: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: '副業',
    type: CategoryType.income,
    colorHex: '#10b981',
    userId: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// テスト用のデフォルト取引
export const defaultTestTransactions: Transaction[] = [
  {
    id: 1,
    amount: 300000,
    memo: '月給',
    type: TransactionType.income,
    transDate: '2024-01-01',
    categoryId: 2,
    userId: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    amount: 1500,
    memo: 'ランチ',
    type: TransactionType.expense,
    transDate: '2024-01-02',
    categoryId: 1,
    userId: 1,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    amount: 500,
    memo: '電車代',
    type: TransactionType.expense,
    transDate: '2024-01-03',
    categoryId: 3,
    userId: 1,
    createdAt: '2024-01-03T00:00:00Z',
  },
];

// ランダムなテストデータ生成関数
export function generateTestUser(): User {
  return {
    id: faker.number.int({ min: 1, max: 999999 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past().toISOString(),
  };
}

export function generateTestCategory(type?: CategoryType): Category {
  const categoryType =
    type || faker.helpers.arrayElement([CategoryType.income, CategoryType.expense]);

  return {
    id: faker.number.int({ min: 1, max: 999999 }),
    name:
      categoryType === CategoryType.income
        ? faker.helpers.arrayElement(['給与', '副業', 'ボーナス', '投資', '賞金'])
        : faker.helpers.arrayElement([
            '食費',
            '交通費',
            '光熱費',
            '通信費',
            '娯楽費',
            '医療費',
            '服飾費',
          ]),
    type: categoryType,
    colorHex: faker.internet.color(),
    userId: faker.number.int({ min: 1, max: 999999 }),
    createdAt: faker.date.past().toISOString(),
  };
}

export function generateTestTransaction(category?: Category): Transaction {
  const testCategory = category || generateTestCategory();
  const transactionType =
    testCategory.type === CategoryType.income ? TransactionType.income : TransactionType.expense;

  return {
    id: faker.number.int({ min: 1, max: 999999 }),
    amount: faker.number.int({ min: 100, max: 50000 }),
    memo: faker.commerce.productName(),
    type: transactionType,
    transDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    categoryId: testCategory.id,
    userId: faker.number.int({ min: 1, max: 999999 }),
    createdAt: faker.date.past().toISOString(),
  };
}

// 大量のテストデータを生成
export function generateManyTestTransactions(count: number): Transaction[] {
  return Array.from({ length: count }, () => generateTestTransaction());
}

export function generateManyTestCategories(count: number): Category[] {
  return Array.from({ length: count }, () => generateTestCategory());
}

// 月次統計用のテストデータ
export function generateCurrentMonthTransactions(): Transaction[] {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  return Array.from({ length: 20 }, () => {
    const transaction = generateTestTransaction();
    // 今月の日付に調整
    const randomDate = faker.date.between({ from: startOfMonth, to: endOfMonth });
    return {
      ...transaction,
      transDate: randomDate.toISOString().split('T')[0],
    };
  });
}

// E2Eテスト用の特定のテストユーザー
export const e2eTestUser = {
  name: 'E2Eテスト太郎',
  email: 'e2e-test@example.com',
  password: 'e2e-test-password-123',
};
