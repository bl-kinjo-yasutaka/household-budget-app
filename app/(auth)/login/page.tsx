'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePostAuthLogin } from '@/src/api/generated/auth/auth';
import { useAuth } from '@/src/contexts/auth-context';
import { useState } from 'react';
import { loginSchema, type LoginForm } from '@/src/lib/schemas';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { showError } = useErrorHandler();
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: (response) => {
        login(response.token, response.user);
      },
      onError: (error: unknown) => {
        // ログインフォームでは画面内にエラー表示するため silent モードを使用
        showError(error, 'user login', {
          silent: true,
          fallbackMessage: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
        });

        // フォーム内表示用のエラーメッセージを設定
        setServerError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      },
    },
  });

  const onSubmit = (data: LoginForm) => {
    setServerError('');
    loginMutation.mutate({ data });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        <CardDescription>家計簿アプリにログイン</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              placeholder="example@example.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              {...register('password')}
              type="password"
              id="password"
              placeholder="パスワード"
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className="w-full"
          >
            {isSubmitting || loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                アカウント作成
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
