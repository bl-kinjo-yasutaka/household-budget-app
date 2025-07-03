'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, type CategoryFormData } from '@/src/lib/schemas/categories';
import type { Category } from '@/src/api/generated/model';
import { CategoryFormContent } from './category-form-content';
import { useUpdateCategory } from '@/hooks/api/useCategories';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  // 編集用の初期値に直接categoryを使用
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      colorHex: category.colorHex,
      type: category.type,
    },
  });

  const updateCategory = useUpdateCategory(category.id, {
    onSuccess: () => {
      onClose();
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
