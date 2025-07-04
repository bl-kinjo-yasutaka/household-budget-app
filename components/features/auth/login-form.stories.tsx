import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '@/src/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertCircle } from 'lucide-react';

// Storybook用のLoginFormコンポーネント
interface LoginFormProps {
  onSubmit: (data: LoginForm) => void;
  isLoading?: boolean;
  serverError?: string;
}

function LoginFormComponent({ onSubmit, isLoading = false, serverError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

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

          <Button type="submit" disabled={isSubmitting || isLoading} className="w-full">
            {isSubmitting || isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は{' '}
              <a href="/signup" className="text-primary hover:underline font-medium">
                アカウント作成
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const meta: Meta<typeof LoginFormComponent> = {
  title: 'Features/Auth/LoginForm',
  component: LoginFormComponent,
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
    onSubmit: (data: LoginForm) => console.log('Login submitted:', data),
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data: LoginForm) => console.log('Login submitted:', data),
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    onSubmit: (data: LoginForm) => console.log('Login submitted:', data),
    serverError: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
  },
};

export const WithValidationError: Story = {
  args: {
    onSubmit: (data: LoginForm) => console.log('Login submitted:', data),
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
