'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Lock, Trash2 } from 'lucide-react';

// 設定フォームコンポーネントの動的インポート（ローディング状態付き）
const UserSettingsForm = dynamic(
  () => import('./user-settings-form').then((mod) => ({ default: mod.UserSettingsForm })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            アプリ設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">設定を読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

const PasswordChangeForm = dynamic(
  () => import('./password-change-form').then((mod) => ({ default: mod.PasswordChangeForm })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            パスワード変更
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">フォームを読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

const AccountDeleteForm = dynamic(
  () => import('./account-delete-form').then((mod) => ({ default: mod.AccountDeleteForm })),
  {
    loading: () => (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            アカウント削除
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-destructive"></div>
              <p className="text-sm text-muted-foreground">フォームを読み込み中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

export { UserSettingsForm, PasswordChangeForm, AccountDeleteForm };
