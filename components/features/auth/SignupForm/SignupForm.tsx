'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signupSchema, type SignupForm as SignupFormType } from '@/src/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertCircle } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (data: SignupFormType) => void;
  isLoading?: boolean;
  serverError?: string;
  showLoginLink?: boolean;
}

export function SignupForm({
  onSubmit,
  isLoading = false,
  serverError = '',
  showLoginLink = true,
}: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  });

  const isFormLoading = isLoading || isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">アカウント作成</CardTitle>
        <CardDescription>家計簿アプリへようこそ</CardDescription>
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
            <Label htmlFor="name">名前</Label>
            <Input
              {...register('name')}
              type="text"
              id="name"
              placeholder="田中太郎"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

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
              placeholder="8文字以上"
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード確認</Label>
            <Input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              placeholder="パスワードを再入力"
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isFormLoading} className="w-full">
            {isFormLoading ? 'アカウント作成中...' : 'アカウント作成'}
          </Button>

          {showLoginLink && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちですか？{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
