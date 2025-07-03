'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Lock } from 'lucide-react';
import { useChangePassword } from '@/hooks/api/useUserSettings';

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
  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePassword = useChangePassword({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (data: PasswordChangeFormData) => {
    // API用のデータ形式に変換（confirmPasswordを除く）
    const requestData = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    changePassword.mutate({ data: requestData });
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

            <Button type="submit" className="w-full" disabled={changePassword.isPending}>
              {changePassword.isPending ? '変更中...' : 'パスワードを変更'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
