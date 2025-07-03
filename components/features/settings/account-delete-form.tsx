'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteUserMe } from '@/src/api/generated/users/users';
import {
  accountDeleteRequestSchema,
  AccountDeleteRequestFormData,
} from '@/src/lib/schemas/settings';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/src/contexts/auth-context';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { AccountDeleteWarning } from './account-delete-warning';
import { AccountDeletePasswordForm } from './account-delete-password-form';

/**
 * アカウント削除フォームコンポーネント
 *
 * @description
 * ユーザーアカウントの削除機能を提供する。
 * セキュリティのためパスワード確認と二重確認ダイアログを実装。
 * 削除後は自動的にログアウトしてログインページにリダイレクトする。
 *
 * @features
 * - パスワード確認による本人認証
 * - 確認ダイアログによる誤操作防止
 * - 視覚的な警告表示
 * - 削除後の自動ログアウト
 */
export function AccountDeleteForm() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();
  const deleteAccount = useDeleteUserMe();
  const { state: confirmState, showConfirmation, hideConfirmation } = useConfirmationDialog();

  const form = useForm<AccountDeleteRequestFormData>({
    resolver: zodResolver(accountDeleteRequestSchema),
    defaultValues: {
      password: '',
    },
  });

  const [pendingData, setPendingData] = useState<AccountDeleteRequestFormData | null>(null);

  /**
   * アカウント削除の実行処理
   *
   * @param data - フォームデータ（パスワード）
   */
  const handleAccountDelete = async (data: AccountDeleteRequestFormData) => {
    try {
      await deleteAccount.mutateAsync({ data: pendingData || data });
      showSuccess('アカウントが削除されました');

      // ログアウトしてログインページにリダイレクト
      logout();
      router.push('/login');
    } catch (error) {
      showError(error, 'account deletion', {
        fallbackMessage: 'アカウントの削除に失敗しました',
      });
    } finally {
      hideConfirmation();
      setPendingData(null);
    }
  };

  /**
   * フォーム送信時の処理（確認ダイアログを表示）
   *
   * @param data - フォームデータ（パスワード）
   */
  const onSubmit = async (data: AccountDeleteRequestFormData) => {
    setPendingData(data);
    showConfirmation(
      {
        title: 'アカウントを削除しますか？',
        description: 'この操作は取り消すことができません。すべてのデータが完全に削除されます。',
        onConfirm: () => handleAccountDelete(data),
      },
      {
        confirmText: '削除する',
        variant: 'destructive',
      }
    );
  };

  return (
    <>
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            アカウント削除
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AccountDeleteWarning />

            <FormProvider {...form}>
              <AccountDeletePasswordForm onSubmit={onSubmit} isLoading={deleteAccount.isPending} />
            </FormProvider>
          </div>
        </CardContent>
      </Card>

      {confirmState.open && (
        <ConfirmationDialog
          open={confirmState.open}
          title={confirmState.title}
          description={confirmState.description}
          onConfirm={confirmState.onConfirm}
          onCancel={hideConfirmation}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          isLoading={deleteAccount.isPending}
        />
      )}
    </>
  );
}
