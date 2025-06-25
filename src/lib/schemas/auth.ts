import { z } from 'zod';

// ログインスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .max(191, 'メールアドレスは191文字以内で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(191, 'パスワードは191文字以内で入力してください'),
});

// サインアップスキーマ
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, '名前を入力してください')
      .max(100, '名前は100文字以内で入力してください'),
    email: z
      .string()
      .email('有効なメールアドレスを入力してください')
      .max(191, 'メールアドレスは191文字以内で入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(191, 'パスワードは191文字以内で入力してください'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// 型エクスポート
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
