'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordChangeSchema, PasswordChangeFormData } from '@/src/lib/schemas/settings';
import { usePutUserPassword } from '@/src/api/generated/users/users';
import { Lock } from 'lucide-react';
import { useAuth } from '@/src/contexts/auth-context';
import { useErrorHandler } from '@/hooks/useErrorHandler';

/**
 * パスワード変更フォームコンポーネント
 *
 * @description
 * ユーザーのパスワード変更機能を提供する。
 * セキュリティのため現在のパスワード確認と新しいパスワードの二重入力を要求。
 *
 * @features
 * - 現在のパスワード確認
 * - 新しいパスワードの強度チェック
 * - パスワード確認による入力ミス防止
 * - 適切なエラーハンドリング
 */
export function PasswordChangeForm() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showError, showSuccess } = useErrorHandler();
  const putUserPassword = usePutUserPassword();

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      // API用のデータ形式に変換（confirmPasswordを除く）
      const requestData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      await putUserPassword.mutateAsync({ data: requestData });

      // フォームをリセット
      form.reset();

      showSuccess('パスワードを変更しました', 'セキュリティのため、再度ログインしてください');

      // セキュリティのためログアウトしてログインページにリダイレクト
      logout();
      router.push('/login');
    } catch (error) {
      showError(error, 'password change', {
        fallbackMessage: 'パスワードの変更に失敗しました',
        showValidationDetails: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          パスワード変更
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在のパスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="現在のパスワードを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しいパスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="新しいパスワードを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード確認</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="新しいパスワードを再入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={putUserPassword.isPending}>
              {putUserPassword.isPending ? '変更中...' : 'パスワードを変更'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
