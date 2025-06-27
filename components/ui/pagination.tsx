'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showItemsRange?: boolean;
  size?: 'default' | 'compact' | 'minimal';
  variant?: 'bordered' | 'plain' | 'card';
  density?: 'full' | 'nav-only' | 'minimal';
  className?: string;
  disabled?: boolean;
}

const sizeVariants = {
  default: 'px-6 py-4',
  compact: 'px-4 py-3',
  minimal: 'px-2 py-2',
};

const styleVariants = {
  bordered: 'border-t bg-muted/25',
  plain: '',
  card: 'border rounded-lg bg-background shadow-sm',
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showItemsRange = true,
  size = 'default',
  variant = 'bordered',
  density = 'full',
  className,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const containerClasses = cn(
    'flex items-center justify-between',
    sizeVariants[size],
    styleVariants[variant],
    className
  );

  const buttonSize = size === 'minimal' ? 'sm' : size === 'compact' ? 'sm' : 'sm';
  const textSize = size === 'minimal' ? 'text-xs' : 'text-sm';

  const renderItemsRange = () => {
    if (!showItemsRange || density === 'nav-only' || density === 'minimal') return null;

    return (
      <div className={cn(textSize, 'text-muted-foreground')}>
        {totalItems} 件中 {startIndex + 1} - {Math.min(endIndex, totalItems)} 件を表示
      </div>
    );
  };

  const renderPageInfo = () => {
    if (density === 'nav-only') return null;

    const pageInfoClasses = cn(
      textSize,
      'px-3 py-1 bg-background rounded border',
      size === 'minimal' && 'px-2 py-0.5'
    );

    return (
      <div className={pageInfoClasses}>
        {currentPage} / {totalPages}
      </div>
    );
  };

  const renderNavButtons = () => {
    const iconSize = size === 'minimal' ? 'h-3 w-3' : 'h-4 w-4';
    const buttonSpacing = size === 'minimal' ? 'space-x-1' : 'space-x-2';

    return (
      <div className={cn('flex items-center', buttonSpacing)}>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={disabled || currentPage === 1}
          aria-label="前のページへ"
        >
          <ChevronLeft className={iconSize} />
          {size !== 'minimal' && '前へ'}
        </Button>

        {renderPageInfo()}

        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={disabled || currentPage === totalPages}
          aria-label="次のページへ"
        >
          {size !== 'minimal' && '次へ'}
          <ChevronRight className={iconSize} />
        </Button>
      </div>
    );
  };

  // density が 'minimal' の場合は、ナビゲーションのみをセンター表示
  if (density === 'minimal') {
    return <div className={cn(containerClasses, 'justify-center')}>{renderNavButtons()}</div>;
  }

  // density が 'nav-only' の場合は、アイテム範囲表示なしで右寄せナビゲーション
  if (density === 'nav-only') {
    return <div className={cn(containerClasses, 'justify-end')}>{renderNavButtons()}</div>;
  }

  // 'full' density - 完全な情報表示
  return (
    <div className={containerClasses}>
      {renderItemsRange()}
      {renderNavButtons()}
    </div>
  );
}
