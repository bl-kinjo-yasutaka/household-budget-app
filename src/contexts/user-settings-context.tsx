'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useGetUserSettings } from '@/src/api/generated/user-settings/user-settings';
import { useAuth } from '@/src/contexts/auth-context';
import type { UserSettings } from '@/src/api/generated/model';

interface UserSettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  refetch: () => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

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

  return (
    <UserSettingsContext.Provider
      value={{
        settings: settings || null,
        isLoading,
        refetch,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}
