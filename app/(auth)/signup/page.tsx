'use client';

import { usePostAuthSignup } from '@/src/api/generated/auth/auth';
import { useAuth } from '@/src/contexts/auth-context';
import { useState } from 'react';
import { type SignupForm } from '@/src/lib/schemas';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { SignupForm as SignupFormComponent } from '@/components/features/auth/SignupForm';

export default function SignupPage() {
  const { login } = useAuth();
  const { showError } = useErrorHandler();
  const [serverError, setServerError] = useState<string>('');

  const signupMutation = usePostAuthSignup({
    mutation: {
      onSuccess: (response) => {
        login(response.token, response.user);
      },
      onError: (error: unknown) => {
        // サインアップフォームでは画面内にエラー表示するため silent モードを使用
        showError(error, 'user signup', {
          silent: true,
          fallbackMessage: 'アカウントの作成に失敗しました',
        });

        // フォーム内表示用のエラーメッセージを設定
        setServerError('アカウントの作成に失敗しました');
      },
    },
  });

  const onSubmit = (data: SignupForm) => {
    setServerError('');
    signupMutation.mutate({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <SignupFormComponent
      onSubmit={onSubmit}
      isLoading={signupMutation.isPending}
      serverError={serverError}
      showLoginLink={true}
    />
  );
}
