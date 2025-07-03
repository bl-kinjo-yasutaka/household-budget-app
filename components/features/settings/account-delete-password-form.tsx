'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AccountDeleteRequestFormData } from '@/src/lib/schemas/settings';

interface AccountDeletePasswordFormProps {
  onSubmit: (data: AccountDeleteRequestFormData) => void;
  isLoading: boolean;
}

/**
 * アカウント削除用パスワード入力フォーム
 *
 * @description
 * アカウント削除確認のためのパスワード入力フォーム
 * セキュリティのため現在のパスワードの入力を要求する
 * useFormContextを使用してフォームの状態にアクセスする
 *
 * @param onSubmit - フォーム送信時のコールバック
 * @param isLoading - 削除処理中のローディング状態
 */
export function AccountDeletePasswordForm({ onSubmit, isLoading }: AccountDeletePasswordFormProps) {
  const form = useFormContext<AccountDeleteRequestFormData>();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>パスワード確認</FormLabel>
            <FormControl>
              <Input type="password" placeholder="現在のパスワードを入力してください" {...field} />
            </FormControl>
            <FormDescription>
              アカウント削除の確認のため、現在のパスワードを入力してください
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" variant="destructive" disabled={isLoading} className="w-full">
        {isLoading ? '削除中...' : 'アカウントを削除'}
      </Button>
    </form>
  );
}
