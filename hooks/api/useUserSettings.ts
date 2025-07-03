import {
  putUserSettings,
  getGetUserSettingsQueryKey,
} from '@/src/api/generated/user-settings/user-settings';
import { putUserPassword, deleteUserMe } from '@/src/api/generated/users/users';
import {
  useMutationWithErrorHandling,
  mutationPresets,
} from '@/hooks/useMutationWithErrorHandling';
import type { UserSettingsFormData } from '@/src/lib/schemas/settings';
import type { AccountDeleteRequestFormData } from '@/src/lib/schemas/settings';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/auth-context';

/**
 * ユーザー設定更新用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useUpdateUserSettings(options?: {
  onSuccess?: () => void;
  onSettled?: () => void;
}) {
  return useMutationWithErrorHandling(
    (data: { data: UserSettingsFormData }) => putUserSettings(data.data),
    {
      ...mutationPresets.update('設定', '/user-settings'),
      invalidateQueries: [getGetUserSettingsQueryKey()[0]],
      ...options,
    }
  );
}

/**
 * パスワード変更用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useChangePassword(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutationWithErrorHandling(
    (data: { data: { currentPassword: string; newPassword: string } }) =>
      putUserPassword(data.data),
    {
      successMessage: 'パスワードを変更しました',
      successDescription: 'セキュリティのため、再度ログインしてください',
      errorContext: 'password change',
      errorFallbackMessage: 'パスワードの変更に失敗しました',
      showValidationDetails: true,
      onSuccess: () => {
        options?.onSuccess?.();
        logout();
        router.push('/login');
      },
      onSettled: options?.onSettled,
    }
  );
}

/**
 * アカウント削除用のmutation hook
 *
 * @param options - 追加のオプション（onSuccess, onSettledなど）
 */
export function useDeleteAccount(options?: { onSuccess?: () => void; onSettled?: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutationWithErrorHandling(
    (data: { data: AccountDeleteRequestFormData }) => deleteUserMe(data.data),
    {
      successMessage: 'アカウントが削除されました',
      errorContext: 'account deletion',
      errorFallbackMessage: 'アカウントの削除に失敗しました',
      onSuccess: () => {
        options?.onSuccess?.();
        logout();
        router.push('/login');
      },
      onSettled: options?.onSettled,
    }
  );
}
