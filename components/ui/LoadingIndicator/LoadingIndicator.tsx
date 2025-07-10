import { cn } from '@/src/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface LoadingIndicatorProps {
  /** ローディングのバリアント */
  variant: 'spinner' | 'chart' | 'form-skeleton' | 'stats-skeleton' | 'list-skeleton';
  /** 繰り返し回数（スケルトン用） */
  count?: number;
  /** 高さの指定 */
  height?: string;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 統一ローディングコンポーネント
 *
 * @description
 * アプリケーション全体で一貫したローディング表示を提供。
 * スケルトンUIまたはスピナーを使い分け、適切なローディング状態を表示する。
 */
export function LoadingIndicator({ variant, count = 1, height, className }: LoadingIndicatorProps) {
  const baseClasses = 'animate-pulse bg-muted rounded';

  // 共通のスピナーコンテンツ
  const SpinnerContent = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">読み込み中...</p>
    </div>
  );

  switch (variant) {
    case 'spinner':
      return (
        <div className={cn('flex items-center justify-center', height || 'h-20', className)}>
          <SpinnerContent />
        </div>
      );

    case 'chart':
      return (
        <div className={cn('flex items-center justify-center', height || 'h-72', className)}>
          <SpinnerContent />
        </div>
      );

    case 'form-skeleton':
      return (
        <Card className={className}>
          <CardHeader>
            <div className={cn(baseClasses, 'h-6 w-1/3')} />
            <div className={cn(baseClasses, 'h-4 w-2/3')} />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 取引タイプボタン */}
            <div className="space-y-2">
              <div className={cn(baseClasses, 'h-4 w-20')} />
              <div className="flex gap-2">
                <div className={cn(baseClasses, 'h-10 flex-1')} />
                <div className={cn(baseClasses, 'h-10 flex-1')} />
              </div>
            </div>
            {/* フォームフィールド */}
            {Array.from({ length: count || 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={cn(baseClasses, 'h-4 w-16')} />
                <div className={cn(baseClasses, 'h-10')} />
              </div>
            ))}
            {/* ボタンエリア */}
            <div className="flex justify-end gap-2">
              <div className={cn(baseClasses, 'h-10 w-20')} />
              <div className={cn(baseClasses, 'h-10 w-24')} />
            </div>
          </CardContent>
        </Card>
      );

    case 'stats-skeleton':
      return (
        <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
          {Array.from({ length: count || 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className={cn(baseClasses, 'h-4 w-24')} />
                <div className={cn(baseClasses, 'h-4 w-4')} />
              </CardHeader>
              <CardContent>
                <div className={cn(baseClasses, 'h-8 w-20 mb-1')} />
                <div className={cn(baseClasses, 'h-3 w-32')} />
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'list-skeleton':
      return (
        <div className={cn('space-y-6', className)}>
          {/* 収入カテゴリセクション */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={cn(baseClasses, 'h-3 w-3 rounded-full')} />
                <div className={cn(baseClasses, 'h-6 w-32')} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.max(1, Math.ceil((count || 4) / 2)) }).map((_, i) => (
                  <Card key={`income-${i}`} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} />
                        <div className="space-y-1">
                          <div className={cn(baseClasses, 'h-4 w-20')} />
                          <div className={cn(baseClasses, 'h-3 w-12')} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(baseClasses, 'h-8 w-8')} />
                        <div className={cn(baseClasses, 'h-8 w-8')} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* 支出カテゴリセクション */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={cn(baseClasses, 'h-3 w-3 rounded-full')} />
                <div className={cn(baseClasses, 'h-6 w-32')} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.max(1, Math.floor((count || 4) / 2)) }).map((_, i) => (
                  <Card key={`expense-${i}`} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} />
                        <div className="space-y-1">
                          <div className={cn(baseClasses, 'h-4 w-20')} />
                          <div className={cn(baseClasses, 'h-3 w-12')} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(baseClasses, 'h-8 w-8')} />
                        <div className={cn(baseClasses, 'h-8 w-8')} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );

    default:
      return (
        <div className={cn('flex items-center justify-center', height || 'h-20', className)}>
          <SpinnerContent />
        </div>
      );
  }
}
