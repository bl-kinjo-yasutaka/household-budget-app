'use client';

import { useState } from 'react';
import { useGetCategories } from '@/src/api/generated/categories/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import type { Category } from '@/src/api/generated/model';
import { CategoryCard } from './CategoryCard';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { NetworkErrorState } from '@/components/ui/ErrorState';
import { useDeleteCategory } from '@/hooks/api/useCategories';

interface CategoryListProps {
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
}

export function CategoryList({ onCreateCategory, onEditCategory }: CategoryListProps) {
  const { data: categories, isLoading, error, refetch } = useGetCategories();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteCategory = useDeleteCategory({
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDeleteCategory = async (id: number) => {
    setDeletingId(id);
    deleteCategory.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="animate-pulse bg-muted rounded h-6 w-32" />
            <div className="animate-pulse bg-muted rounded h-4 w-24" />
          </div>
          <Button onClick={onCreateCategory}>
            <Plus className="h-4 w-4" />
            新しいカテゴリ
          </Button>
        </div>
        <LoadingIndicator variant="list-skeleton" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">カテゴリ一覧</h2>
            <p className="text-sm text-muted-foreground">エラーが発生しました</p>
          </div>
          <Button onClick={onCreateCategory}>
            <Plus className="h-4 w-4" />
            新しいカテゴリ
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <NetworkErrorState onRetry={() => refetch()} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">カテゴリ一覧</CardTitle>
            <Button onClick={onCreateCategory}>
              <Plus className="h-4 w-4" />
              新しいカテゴリ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">カテゴリがありません</h3>
            <p className="text-muted-foreground mb-4">
              最初のカテゴリを作成して取引を分類しましょう
            </p>
            <Button onClick={onCreateCategory}>
              <Plus className="h-4 w-4" />
              カテゴリを作成
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // カテゴリを収入・支出でグループ化
  const incomeCategories = categories.filter((cat) => cat.type === 'income');
  const expenseCategories = categories.filter((cat) => cat.type === 'expense');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">カテゴリ一覧</h2>
          <p className="text-sm text-muted-foreground">合計 {categories.length} 個のカテゴリ</p>
        </div>
        <Button onClick={onCreateCategory}>
          <Plus className="h-4 w-4" />
          新しいカテゴリ
        </Button>
      </div>

      {/* 収入カテゴリ */}
      {incomeCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              収入カテゴリ ({incomeCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {incomeCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => onEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  isDeleting={deletingId === category.id}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 支出カテゴリ */}
      {expenseCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              支出カテゴリ ({expenseCategories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {expenseCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => onEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  isDeleting={deletingId === category.id}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
