import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartEmptyProps {
  title: string;
  message: string;
}

/**
 * チャート用空状態コンポーネント
 *
 * @description
 * ダッシュボードのチャートコンポーネントでデータが存在しない場合の共通UI。
 * 一貫したユーザー体験を提供するため分離。
 *
 * @param title - チャートのタイトル
 * @param message - 空状態時のメッセージ
 */
export function ChartEmpty({ title, message }: ChartEmptyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
