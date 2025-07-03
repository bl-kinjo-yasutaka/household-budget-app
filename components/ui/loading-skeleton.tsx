import { cn } from '@/src/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LoadingSkeletonProps {
  /** スケルトンのバリアント */
  variant: 'card' | 'table' | 'form' | 'chart' | 'stats' | 'list';
  /** 繰り返し回数 */
  count?: number;
  /** 高さの指定 */
  height?: string;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 統一ローディングスケルトンコンポーネント
 *
 * @description
 * アプリケーション全体で一貫したローディング表示を提供。
 * レイアウトシフトを防ぎ、コンテンツの構造を保持する。
 */
export function LoadingSkeleton({ variant, count = 1, height, className }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted rounded';

  switch (variant) {
    case 'card':
      return (
        <div className={cn('space-y-4', className)}>
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className={cn(baseClasses, 'h-6 w-3/4 mb-2')} />
                <div className={cn(baseClasses, 'h-4 w-1/2')} />
              </CardHeader>
              <CardContent>
                <div className={cn(baseClasses, height || 'h-24')} />
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className={className}>
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableHead key={i}>
                    <div className={cn(baseClasses, 'h-4')} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: count }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className={cn(baseClasses, 'h-4')} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );

    case 'form':
      return (
        <div className={cn('space-y-6', className)}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={cn(baseClasses, 'h-4 w-20')} />
              <div className={cn(baseClasses, 'h-10')} />
            </div>
          ))}
          <div className={cn(baseClasses, 'h-10 w-24')} />
        </div>
      );

    case 'chart':
      return (
        <Card className={className}>
          <CardHeader>
            <div className={cn(baseClasses, 'h-6 w-1/3')} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center" style={{ height: height || '300px' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">チャートを読み込み中...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'stats':
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

    case 'list':
      return (
        <div className={cn('space-y-2', className)}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
              <div className={cn(baseClasses, 'h-10 w-10 rounded-full')} />
              <div className="flex-1 space-y-2">
                <div className={cn(baseClasses, 'h-4 w-3/4')} />
                <div className={cn(baseClasses, 'h-3 w-1/2')} />
              </div>
              <div className={cn(baseClasses, 'h-4 w-16')} />
            </div>
          ))}
        </div>
      );

    default:
      return <div className={cn(baseClasses, height || 'h-4', className)} />;
  }
}
