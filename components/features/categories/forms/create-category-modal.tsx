'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, type CategoryFormData } from '@/src/lib/schemas/categories';
import { CategoryFormContent, PRESET_COLORS } from './category-form-content';
import { useCreateCategory } from '@/hooks/api/useCategories';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  // 新規作成用の固定初期値
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      colorHex: PRESET_COLORS[0],
      type: 'expense' as const,
    },
  });

  const createCategory = useCreateCategory({
    onSuccess: () => {
      form.reset(); // フォームをリセット
      onClose();
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
