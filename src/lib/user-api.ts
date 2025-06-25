import { useGetUserMe } from '@/src/api/generated/users/users';
import { UseQueryResult } from '@tanstack/react-query';
import { User } from '@/src/api/generated/model';

/**
 * 現在のユーザー情報を取得するカスタムフック
 *
 * /user/me エンドポイントを使用してログインユーザーの情報を取得
 * JWTトークンがCookieから自動的に送信される
 */
export function useCurrentUser(): UseQueryResult<User | undefined, unknown> {
  return useGetUserMe({
    query: {
      retry: (failureCount, error) => {
        // 401エラーの場合はリトライしない（認証エラー）
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
      gcTime: 10 * 60 * 1000, // 10分間メモリに保持
    },
  });
}

/**
 * ユーザー情報取得用のクエリキー
 * React Queryのキャッシュ管理に使用
 */
export const USER_QUERY_KEY = ['getUserMe'];

/**
 * ユーザー情報のキャッシュを無効化
 */
export const invalidateUserQuery = (queryClient: unknown) => {
  const client = queryClient as { invalidateQueries: (options: { queryKey: string[] }) => void };
  client.invalidateQueries({ queryKey: USER_QUERY_KEY });
};
