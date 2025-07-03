'use client';

import { useState } from 'react';
import { usePostAuthLogin } from '@/src/api/generated/auth/auth';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { logger } from '@/src/lib/logger';

export default function TestApiConnection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginMutation = usePostAuthLogin();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories({
    query: {
      enabled: isLoggedIn,
    },
  });

  const handleLogin = async () => {
    try {
      const result = await loginMutation.mutateAsync({
        data: {
          email: 'demo@example.com',
          password: 'password123',
        },
      });

      if (result && 'token' in result) {
        localStorage.setItem('authToken', result.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      logger.error('ログインエラー:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-bold mb-4">API接続テスト</h2>

      {!isLoggedIn ? (
        <div>
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'ログイン中...' : 'テストログイン'}
          </button>
          {loginMutation.isError && <p className="text-red-500 mt-2">ログインに失敗しました</p>}
        </div>
      ) : (
        <div>
          <p className="text-green-600 mb-4">✓ ログイン成功</p>

          <h3 className="font-semibold mb-2">カテゴリ一覧:</h3>
          {categoriesLoading ? (
            <p>読み込み中...</p>
          ) : categories && categories.length > 0 ? (
            <ul className="list-disc pl-5">
              {categories.map((category) => (
                <li key={category.id}>
                  {category.name} ({category.type})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">カテゴリがありません</p>
          )}
        </div>
      )}
    </div>
  );
}
