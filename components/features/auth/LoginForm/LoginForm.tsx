'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema, type LoginForm as LoginFormType } from '@/src/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: LoginFormType) => void;
  isLoading?: boolean;
  serverError?: string;
  showSignupLink?: boolean;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  serverError = '',
  showSignupLink = true,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const isFormLoading = isLoading || isSubmitting;

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

          <Button type="submit" disabled={isFormLoading} className="w-full">
            {isFormLoading ? 'ログイン中...' : 'ログイン'}
          </Button>

          {showSignupLink && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでない方は{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  アカウント作成
                </Link>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
