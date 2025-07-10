import { cn } from '@/src/lib/utils';
import type { Category } from '@/src/api/generated/model';

interface CategoryColorBadgeProps {
  /** カテゴリオブジェクト */
  category?: Category | null;
  /** カラーインジケーターのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** カテゴリ名を表示するか */
  showName?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** 名前部分のカスタムクラス名 */
  nameClassName?: string;
  /** カテゴリが存在しない場合の表示テキスト */
  fallbackText?: string;
}

/**
 * カテゴリの色と名前を表示する統一コンポーネント
 *
 * @description
 * カテゴリの色インジケーターと名前を一貫したスタイルで表示。
 * テーブル、カード、フィルターなど様々な場所で再利用可能。
 *
 * @example
 * ```tsx
 * // 基本的な使用
 * <CategoryColorBadge category={category} />
 *
 * // サイズとオプションのカスタマイズ
 * <CategoryColorBadge
 *   category={category}
 *   size="lg"
 *   showName={false}
 *   className="mr-2"
 * />
 *
 * // カテゴリなしの場合
 * <CategoryColorBadge
 *   category={null}
 *   fallbackText="未分類"
 * />
 * ```
 */
export function CategoryColorBadge({
  category,
  size = 'md',
  showName = true,
  className,
  nameClassName,
  fallbackText = '-',
}: CategoryColorBadgeProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // カテゴリが存在しない場合
  if (!category) {
    return (
      <span className={cn('text-muted-foreground', textSizeClasses[size], className)}>
        {fallbackText}
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn('rounded-full flex-shrink-0', sizeClasses[size])}
        style={{ backgroundColor: category.colorHex }}
        aria-hidden="true"
      />
      {showName && (
        <span className={cn(textSizeClasses[size], nameClassName)} title={category.name}>
          {category.name}
        </span>
      )}
    </div>
  );
}
