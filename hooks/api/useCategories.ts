import {
  postCategories,
  putCategoriesId,
  deleteCategoriesId,
} from '@/src/api/generated/categories/categories';
import {
  useMutationWithErrorHandling,
  mutationPresets,
} from '@/hooks/useMutationWithErrorHandling';
import type { CategoryFormData } from '@/src/lib/schemas/categories';

/**
 * カテゴリ作成用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useCreateCategory(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  return useMutationWithErrorHandling(
    (data: { data: CategoryFormData }) => postCategories(data.data),
    {
      ...mutationPresets.create('カテゴリ', '/categories'),
      ...options,
    }
  );
}

/**
 * カテゴリ更新用のmutation hook
 *
 * @param categoryId - 更新対象のカテゴリID
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useUpdateCategory(
  categoryId?: number,
  options?: {
    onSuccess?: () => void;
    onSettled?: () => void;
  }
) {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: number; data: CategoryFormData }) => putCategoriesId(id, data),
    {
      ...mutationPresets.update('カテゴリ', '/categories', categoryId),
      ...options,
    }
  );
}

/**
 * カテゴリ削除用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useDeleteCategory(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  return useMutationWithErrorHandling(({ id }: { id: number }) => deleteCategoriesId(id), {
    ...mutationPresets.delete('カテゴリ', '/categories'),
    ...options,
  });
}
