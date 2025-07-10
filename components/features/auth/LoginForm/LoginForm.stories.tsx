import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { useState } from 'react';
import type { LoginForm as LoginFormType } from '@/src/lib/schemas';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
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
    showSignupLink: {
      control: 'boolean',
      description: 'サインアップリンクの表示',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data: LoginFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: '',
    showSignupLink: true,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data: LoginFormType) => console.log('Form submitted:', data),
    isLoading: true,
    serverError: '',
    showSignupLink: true,
  },
};

export const WithServerError: Story = {
  args: {
    onSubmit: (data: LoginFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
    showSignupLink: true,
  },
};

export const WithoutSignupLink: Story = {
  args: {
    onSubmit: (data: LoginFormType) => console.log('Form submitted:', data),
    isLoading: false,
    serverError: '',
    showSignupLink: false,
  },
};

export const Interactive: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleSubmit = (data: LoginFormType) => {
      setIsLoading(true);
      setServerError('');

      // 実際のログイン処理をシミュレート
      setTimeout(() => {
        setIsLoading(false);

        // デモ用の認証ロジック
        if (data.email === 'demo@example.com' && data.password === 'password123') {
          console.log('Login successful:', data);
          alert('ログイン成功！');
        } else {
          setServerError('メールアドレスまたはパスワードが正しくありません。');
        }
      }, 2000);
    };

    return (
      <div className="space-y-4">
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          serverError={serverError}
          showSignupLink={true}
        />
        <div className="text-center text-sm text-muted-foreground">
          <p>デモ用認証情報:</p>
          <p>Email: demo@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    );
  },
};
