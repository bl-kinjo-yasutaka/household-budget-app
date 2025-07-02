'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePutCategoriesId } from '@/src/api/generated/categories/categories';
import { categoryFormSchema, type CategoryFormData } from '@/src/lib/schemas/categories';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Category } from '@/src/api/generated/model';
import { CategoryFormContent } from './category-form-content';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const queryClient = useQueryClient();

  // 編集用の初期値に直接categoryを使用
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      colorHex: category.colorHex,
      type: category.type,
    },
  });

  const updateCategory = usePutCategoriesId({
    mutation: {
      onSuccess: () => {
        toast.success('カテゴリを更新しました');
        queryClient.invalidateQueries({ queryKey: ['/categories'] });
        onClose();
      },
      onError: (error) => {
        console.error('カテゴリ更新エラー:', error);
        // MSWハンドラーが適切なエラーメッセージを返すので、シンプルな処理で十分
        let errorMessage = 'カテゴリの更新に失敗しました';
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { data?: { error?: string } } }).response;
          if (response?.data?.error) {
            errorMessage = response.data.error;
          }
        }
        toast.error(errorMessage);
      },
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    updateCategory.mutate({
      id: category.id,
      data: {
        name: data.name,
        colorHex: data.colorHex,
        type: data.type,
      },
    });
  };

  return (
    <FormProvider {...form}>
      <CategoryFormContent
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={updateCategory.isPending}
        isEditing={true}
      />
    </FormProvider>
  );
}
