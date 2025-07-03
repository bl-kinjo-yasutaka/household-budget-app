'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDeleteUserMe } from '@/src/api/generated/users/users';
import {
  accountDeleteRequestSchema,
  AccountDeleteRequestFormData,
} from '@/src/lib/schemas/settings';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/src/contexts/auth-context';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';

export function AccountDeleteForm() {
  const router = useRouter();
  const { logout } = useAuth();
  const deleteAccount = useDeleteUserMe();
  const { state: confirmState, showConfirmation, hideConfirmation } = useConfirmationDialog();

  const form = useForm<AccountDeleteRequestFormData>({
    resolver: zodResolver(accountDeleteRequestSchema),
    defaultValues: {
      password: '',
    },
  });

  const [pendingData, setPendingData] = useState<AccountDeleteRequestFormData | null>(null);

  const onSubmit = async (data: AccountDeleteRequestFormData) => {
    setPendingData(data);
    showConfirmation(
      {
        title: 'アカウントを削除しますか？',
        description: 'この操作は取り消すことができません。すべてのデータが完全に削除されます。',
        onConfirm: async () => {
          try {
            await deleteAccount.mutateAsync({ data: pendingData || data });

            toast.success('アカウントが削除されました');

            // ログアウトしてログインページにリダイレクト
            logout();
            router.push('/login');
          } catch (error) {
            console.error('アカウント削除エラー:', error);
            toast.error('アカウントの削除に失敗しました');
          } finally {
            hideConfirmation();
            setPendingData(null);
          }
        },
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
            <div className="rounded-lg bg-destructive/10 p-4">
              <h4 className="text-sm font-medium text-destructive mb-2">⚠️ 重要な注意事項</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• アカウントを削除すると、すべてのデータが完全に削除されます</li>
                <li>• 取引履歴、カテゴリ、設定などすべての情報が失われます</li>
                <li>• この操作は取り消すことができません</li>
              </ul>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード確認</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="現在のパスワードを入力してください"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        アカウント削除の確認のため、現在のパスワードを入力してください
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteAccount.isPending}
                  className="w-full"
                >
                  {deleteAccount.isPending ? '削除中...' : 'アカウントを削除'}
                </Button>
              </form>
            </Form>
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
