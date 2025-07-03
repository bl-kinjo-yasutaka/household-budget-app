import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartLoadingProps {
  title: string;
}

/**
 * チャート用ローディングコンポーネント
 *
 * @description
 * ダッシュボードのチャートコンポーネントで使用する共通のローディングUI。
 * 統一されたローディング体験を提供するため分離。
 *
 * @param title - チャートのタイトル
 */
export function ChartLoading({ title }: ChartLoadingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
