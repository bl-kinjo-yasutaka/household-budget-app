'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/src/api/generated/model';
import { cookieAuth } from '@/src/lib/cookies';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, clearUser, setLoading, setError } from '@/store/slices/userSlice';
import { useCurrentUser } from '@/src/lib/user-api';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: user, loading: userLoading } = useAppSelector((state) => state.user);
  const router = useRouter();
  const queryClient = useQueryClient();

  // トークンの存在確認
  const token = cookieAuth.getToken();
  const isAuthenticated = Boolean(token);

  // ユーザー情報取得（トークンが存在する場合のみ）
  // APIコールタイミング:
  // 1. 初回ロード時にトークンがある場合
  // 2. ログイン後に自動的に実行（React Queryがリフェッチ）
  const userQuery = useCurrentUser();

  // APIコールタイミングの最適化
  useEffect(() => {
    if (isAuthenticated) {
      // トークンが存在する場合：ユーザー情報を取得
      if (!user && !userLoading) {
        dispatch(setLoading(true));
      }

      if (userQuery.data && !userQuery.isLoading) {
        // ユーザー情報の取得成功
        dispatch(setUser(userQuery.data));
      } else if (userQuery.error && !userQuery.isLoading) {
        // ユーザー情報の取得失敗（401など）
        if (
          userQuery.error &&
          typeof userQuery.error === 'object' &&
          'status' in userQuery.error &&
          userQuery.error.status === 401
        ) {
          // 認証エラーの場合：トークンを削除してログアウト
          cookieAuth.clearToken();
          dispatch(clearUser());
          router.push('/login');
        } else {
          dispatch(setError('ユーザー情報の取得に失敗しました'));
        }
      }
    } else {
      // トークンが存在しない場合：ユーザー状態をクリア
      dispatch(clearUser());
    }
  }, [
    isAuthenticated,
    userQuery.data,
    userQuery.error,
    userQuery.isLoading,
    dispatch,
    router,
    user,
    userLoading,
  ]);

  const login = (token: string, user: User) => {
    // 1. トークンをCookieに保存
    cookieAuth.setToken(token);

    // 2. ユーザー情報をReduxに保存（ログイン時はAPIレスポンスから直接設定）
    dispatch(setUser(user));

    // 3. ダッシュボードにリダイレクト
    router.push('/');
  };

  const logout = () => {
    // 1. トークンをクリア
    cookieAuth.clearToken();

    // 2. Redux状態をクリア
    dispatch(clearUser());

    // 3. React Queryキャッシュをクリア
    queryClient.clear();

    // 4. ログインページにリダイレクト
    router.push('/login');
  };

  // ローディング状態の統合
  // - 初回ロード時: トークンがあるがユーザー情報が未取得の場合
  // - API取得中: userQuery.isLoading が true の場合
  const isLoading = userLoading || (isAuthenticated && !user && userQuery.isLoading);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
