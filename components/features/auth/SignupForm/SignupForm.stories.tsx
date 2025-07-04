import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from './SignupForm';
import { useState } from 'react';
import type { SignupForm as SignupFormType } from '@/src/lib/schemas';

const meta: Meta<typeof SignupForm> = {
  title: 'Features/Auth/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    isLoading: {
      control: 'boolean',
      description: 'ローディング状態',
    },
    serverError: {
      control: 'text',
      description: 'サーバーエラーメッセージ',
    },
    showLoginLink: {
      control: 'boolean',
      description: 'ログインリンクの表示',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data: SignupFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: '',
    showLoginLink: true,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data: SignupFormType) => console.log('Form submitted:', data),
    isLoading: true,
    serverError: '',
    showLoginLink: true,
  },
};

export const WithServerError: Story = {
  args: {
    onSubmit: (data: SignupFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: 'アカウントの作成に失敗しました。このメールアドレスは既に使用されています。',
    showLoginLink: true,
  },
};

export const WithoutLoginLink: Story = {
  args: {
    onSubmit: (data: SignupFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: '',
    showLoginLink: false,
  },
};

export const Interactive: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleSubmit = (data: SignupFormType) => {
      setIsLoading(true);
      setServerError('');

      // 実際のサインアップ処理をシミュレート
      setTimeout(() => {
        setIsLoading(false);

        // デモ用のサインアップロジック
        if (data.email === 'existing@example.com') {
          setServerError('このメールアドレスは既に登録されています。');
        } else if (data.password !== data.confirmPassword) {
          setServerError('パスワードが一致しません。');
        } else {
          console.log('Signup successful:', data);
          alert('アカウント作成成功！');
        }
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <SignupForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          serverError={serverError}
          showLoginLink={true}
        />
        <div className="text-center text-sm text-muted-foreground">
          <p>テスト用: existing@example.com でエラーをシミュレート</p>
        </div>
      </div>
    );
  },
};
