import {
  postTransactions,
  putTransactionsId,
  deleteTransactionsId,
} from '@/src/api/generated/transactions/transactions';
import {
  useMutationWithErrorHandling,
  mutationPresets,
} from '@/hooks/useMutationWithErrorHandling';
import type { TransactionFormData } from '@/src/lib/schemas/transactions';
import { useRouter } from 'next/navigation';

/**
 * 取引作成用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useCreateTransaction(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  const router = useRouter();

  return useMutationWithErrorHandling(
    (data: { data: TransactionFormData }) => postTransactions(data.data),
    {
      ...mutationPresets.create('取引', '/transactions'),
      successDescription: '新しい取引が正常に記録されました。',
      onSuccess: () => {
        options?.onSuccess?.();
        router.push('/transactions');
      },
      onSettled: options?.onSettled,
    }
  );
}

/**
 * 取引更新用のmutation hook
 *
 * @param transactionId - 更新対象の取引ID
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useUpdateTransaction(
  transactionId?: number,
  options?: {
    onSuccess?: () => void;
    onSettled?: () => void;
  }
) {
  const router = useRouter();

  return useMutationWithErrorHandling(
    ({ id, data }: { id: number; data: TransactionFormData }) => putTransactionsId(id, data),
    {
      ...mutationPresets.update('取引', '/transactions', transactionId),
      successDescription: '取引情報が正常に更新されました。',
      onSuccess: () => {
        options?.onSuccess?.();
        router.push('/transactions');
      },
      onSettled: options?.onSettled,
    }
  );
}

/**
 * 取引削除用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useDeleteTransaction(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  const router = useRouter();

  return useMutationWithErrorHandling(({ id }: { id: number }) => deleteTransactionsId(id), {
    ...mutationPresets.delete('取引', '/transactions'),
    successDescription: '取引が正常に削除されました。',
    onSuccess: () => {
      options?.onSuccess?.();
      router.push('/transactions');
    },
    onSettled: options?.onSettled,
  });
}
