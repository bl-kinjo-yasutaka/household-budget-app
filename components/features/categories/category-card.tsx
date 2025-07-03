import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryColorBadge } from '@/components/ui/category-color-badge';
import { Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/src/api/generated/model';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function CategoryCard({ category, onEdit, onDelete, isDeleting }: CategoryCardProps) {
  return (
    <div className="relative group">
      <div
        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
        style={{ borderLeftColor: category.colorHex, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start justify-between mb-2">
          <CategoryColorBadge category={category} size="md" nameClassName="font-medium" />
          <Badge
            variant={category.type === 'income' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {category.type === 'income' ? '収入' : '支出'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={onEdit} className="h-8 px-2">
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 px-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
