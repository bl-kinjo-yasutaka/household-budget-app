'use client';

import { usePostAuthLogin } from '@/src/api/generated/auth/auth';
import { useAuth } from '@/src/contexts/auth-context';
import { useState } from 'react';
import { type LoginForm } from '@/src/lib/schemas';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { LoginForm as LoginFormComponent } from '@/components/features/auth/LoginForm';

export default function LoginPage() {
  const { login } = useAuth();
  const { showError } = useErrorHandler();
  const [serverError, setServerError] = useState<string>('');

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
    <LoginFormComponent
      onSubmit={onSubmit}
      isLoading={loginMutation.isPending}
      serverError={serverError}
      showSignupLink={true}
    />
  );
}
