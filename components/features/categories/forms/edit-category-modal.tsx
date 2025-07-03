'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePutCategoriesId } from '@/src/api/generated/categories/categories';
import { categoryFormSchema, type CategoryFormData } from '@/src/lib/schemas/categories';
import { useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { Category } from '@/src/api/generated/model';
import { CategoryFormContent } from './category-form-content';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const { showError, showSuccess } = useErrorHandler();
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
        showSuccess('カテゴリを更新しました');
        queryClient.invalidateQueries({ queryKey: ['/categories'] });
        onClose();
      },
      onError: (error: unknown) => {
        showError(error, 'category update', {
          fallbackMessage: 'カテゴリの更新に失敗しました',
          showValidationDetails: true,
        });
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
