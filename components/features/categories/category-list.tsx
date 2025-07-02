'use client';

import { useState } from 'react';
import { useGetCategories, useDeleteCategoriesId } from '@/src/api/generated/categories/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Category } from '@/src/api/generated/model';
import { CategoryCard } from './category-card';

interface CategoryListProps {
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
}

export function CategoryList({ onCreateCategory, onEditCategory }: CategoryListProps) {
  const queryClient = useQueryClient();
  const { data: categories, isLoading, error } = useGetCategories();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteCategory = useDeleteCategoriesId({
    mutation: {
      onSuccess: () => {
        toast.success('カテゴリを削除しました');
        queryClient.invalidateQueries({ queryKey: ['/categories'] });
      },
      onError: (error: unknown) => {
        console.error('カテゴリ削除エラー:', error);
        // MSWハンドラーが適切なエラーメッセージを返すので、シンプルな処理で十分
        let errorMessage = 'カテゴリの削除に失敗しました';
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { data?: { error?: string } } }).response;
          if (response?.data?.error) {
            errorMessage = response.data.error;
          }
        }
        toast.error(errorMessage);
      },
      onSettled: () => {
        setDeletingId(null);
      },
    },
  });

  const handleDeleteCategory = async (id: number) => {
    setDeletingId(id);
    deleteCategory.mutate({ id });
  };

  if (isLoading) {
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
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">カテゴリの読み込みに失敗しました</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/categories'] })}
            >
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
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
