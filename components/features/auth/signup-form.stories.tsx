import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupForm } from '@/src/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertCircle } from 'lucide-react';

// Storybook用のSignupFormコンポーネント
interface SignupFormProps {
  onSubmit: (data: SignupForm) => void;
  isLoading?: boolean;
  serverError?: string;
}

function SignupFormComponent({ onSubmit, isLoading = false, serverError }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

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

          <Button type="submit" disabled={isSubmitting || isLoading} className="w-full">
            {isSubmitting || isLoading ? 'アカウント作成中...' : 'アカウント作成'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちですか？{' '}
              <a href="/login" className="text-primary hover:underline font-medium">
                ログイン
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const meta: Meta<typeof SignupFormComponent> = {
  title: 'Features/Auth/SignupForm',
  component: SignupFormComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    isLoading: { control: 'boolean' },
    serverError: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data: SignupForm) => console.log('Signup submitted:', data),
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data: SignupForm) => console.log('Signup submitted:', data),
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    onSubmit: (data: SignupForm) => console.log('Signup submitted:', data),
    serverError: 'アカウントの作成に失敗しました',
  },
};

export const WithValidationError: Story = {
  args: {
    onSubmit: (data: SignupForm) => console.log('Signup submitted:', data),
  },
  play: async ({ canvasElement }) => {
    // バリデーションエラーを表示するため、フォーム送信を実行
    const canvas = canvasElement;
    const submitButton = canvas.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    }
  },
};
