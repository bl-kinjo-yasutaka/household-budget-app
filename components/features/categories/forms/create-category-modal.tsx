'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostCategories } from '@/src/api/generated/categories/categories';
import { categoryFormSchema, type CategoryFormData } from '@/src/lib/schemas/categories';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryFormContent, PRESET_COLORS } from './category-form-content';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const { showError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  // 新規作成用の固定初期値
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      colorHex: PRESET_COLORS[0],
      type: 'expense' as const,
    },
  });

  const createCategory = usePostCategories({
    mutation: {
      onSuccess: () => {
        showSuccess('カテゴリを作成しました');
        queryClient.invalidateQueries({ queryKey: ['/categories'] });
        form.reset(); // フォームをリセット
        onClose();
      },
      onError: (error) => {
        showError(error, 'category creation', {
          fallbackMessage: 'カテゴリの作成に失敗しました',
          showValidationDetails: true,
        });
      },
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    createCategory.mutate({
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
        isLoading={createCategory.isPending}
        isEditing={false}
      />
    </FormProvider>
  );
}
