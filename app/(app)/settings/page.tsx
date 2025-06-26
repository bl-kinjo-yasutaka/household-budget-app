import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Shield, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">設定</h1>
        <p className="text-muted-foreground">アプリの設定とアカウント管理</p>
      </div>

      {/* Settings Categories */}
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
            <Button variant="outline" className="w-full justify-start">
              プロフィール編集
            </Button>
            <Button variant="outline" className="w-full justify-start">
              パスワード変更
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
            <Button variant="outline" className="w-full justify-start">
              通知設定を変更
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              アプリ設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">表示設定とアプリの動作</div>
            <Button variant="outline" className="w-full justify-start">
              表示設定
            </Button>
            <Button variant="outline" className="w-full justify-start">
              データエクスポート
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
            <Button variant="outline" className="w-full justify-start">
              ヘルプセンター
            </Button>
            <Button variant="outline" className="w-full justify-start">
              お問い合わせ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <Shield className="h-5 w-5" />
            危険な操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            アカウントの削除は元に戻すことができません
          </div>
          <Button variant="destructive">アカウントを削除</Button>
        </CardContent>
      </Card>
    </div>
  );
}
