'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useGetUserSettings } from '@/src/api/generated/user-settings/user-settings';
import { useAuth } from '@/src/contexts/auth-context';
import type { UserSettings } from '@/src/api/generated/model';

/**
 * ユーザー設定データのコンテキスト型定義
 */
interface UserSettingsDataContextType {
  settings: UserSettings | null;
  refetch: () => void;
}

/**
 * ローディング状態のコンテキスト型定義
 */
interface UserSettingsLoadingContextType {
  isLoading: boolean;
}

// データ用のコンテキスト
const UserSettingsDataContext = createContext<UserSettingsDataContextType | undefined>(undefined);

// ローディング状態用のコンテキスト
const UserSettingsLoadingContext = createContext<UserSettingsLoadingContextType | undefined>(
  undefined
);

/**
 * ユーザー設定のプロバイダー
 *
 * @description
 * データとローディング状態を分離することで、
 * ローディング状態の変更時にデータを使用するコンポーネントが
 * 不必要に再レンダリングされることを防ぐ
 */
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const {
    data: settings,
    isLoading,
    refetch,
  } = useGetUserSettings({
    query: {
      enabled: isAuthenticated, // 認証済みの場合のみクエリを実行
    },
  });

  // データコンテキストの値をメモ化
  const dataValue = useMemo(
    () => ({
      settings: settings || null,
      refetch,
    }),
    [settings, refetch]
  );

  // ローディングコンテキストの値をメモ化
  const loadingValue = useMemo(
    () => ({
      isLoading,
    }),
    [isLoading]
  );

  return (
    <UserSettingsDataContext.Provider value={dataValue}>
      <UserSettingsLoadingContext.Provider value={loadingValue}>
        {children}
      </UserSettingsLoadingContext.Provider>
    </UserSettingsDataContext.Provider>
  );
}

/**
 * ユーザー設定データを取得するフック
 *
 * @returns ユーザー設定データとrefetch関数
 */
export function useUserSettingsData() {
  const context = useContext(UserSettingsDataContext);
  if (context === undefined) {
    throw new Error('useUserSettingsData must be used within a UserSettingsProvider');
  }
  return context;
}

/**
 * ユーザー設定のローディング状態を取得するフック
 *
 * @returns ローディング状態
 */
export function useUserSettingsLoading() {
  const context = useContext(UserSettingsLoadingContext);
  if (context === undefined) {
    throw new Error('useUserSettingsLoading must be used within a UserSettingsProvider');
  }
  return context;
}
