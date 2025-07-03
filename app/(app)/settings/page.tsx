import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, HelpCircle } from 'lucide-react';
import {
  UserSettingsForm,
  PasswordChangeForm,
  AccountDeleteForm,
} from '@/components/features/settings';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">設定</h1>
        <p className="text-muted-foreground">アプリの設定とアカウント管理</p>
      </div>

      {/* 実装済み機能 */}
      <div className="space-y-6">
        <UserSettingsForm />
        <PasswordChangeForm />
      </div>

      {/* その他の設定項目 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              アカウント設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">プロフィール情報とセキュリティ設定</div>
            <Button variant="outline" className="w-full justify-start" disabled>
              プロフィール編集 (未実装)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              通知設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">アプリの通知と通知頻度</div>
            <Button variant="outline" className="w-full justify-start" disabled>
              通知設定を変更 (未実装)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              その他設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">表示設定とデータ管理</div>
            <Button variant="outline" className="w-full justify-start" disabled>
              表示設定 (未実装)
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              データエクスポート (未実装)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5" />
              サポート
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">ヘルプとサポート情報</div>
            <Button variant="outline" className="w-full justify-start" disabled>
              ヘルプセンター (未実装)
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              お問い合わせ (未実装)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* アカウント削除 - 一番下に配置 */}
      <AccountDeleteForm />
    </div>
  );
}
