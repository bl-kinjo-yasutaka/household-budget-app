import { z } from 'zod';

// 通貨選択肢
export const CURRENCY_OPTIONS = [
  { label: '日本円 (¥)', value: 'JPY' },
  { label: '米ドル ($)', value: 'USD' },
  { label: 'ユーロ (€)', value: 'EUR' },
] as const;

// 週開始曜日選択肢
export const WEEKDAY_OPTIONS = [
  { label: '日曜日', value: 0 },
  { label: '月曜日', value: 1 },
  { label: '火曜日', value: 2 },
  { label: '水曜日', value: 3 },
  { label: '木曜日', value: 4 },
  { label: '金曜日', value: 5 },
  { label: '土曜日', value: 6 },
] as const;

// ユーザー設定スキーマ
export const userSettingsSchema = z.object({
  currency: z.string().max(3, '通貨コードは3文字以内で入力してください'),
  startWeekday: z
    .number()
    .min(0, '週開始曜日は0-6の間で選択してください')
    .max(6, '週開始曜日は0-6の間で選択してください'),
});

// パスワード変更フォーム用スキーマ（confirmPasswordを含む）
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは英大文字・小文字・数字を含む必要があります'
      ),
    confirmPassword: z.string().min(1, 'パスワード確認を入力してください'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// API用パスワード変更スキーマ（confirmPasswordを除く）
export const passwordChangeRequestSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは英大文字・小文字・数字を含む必要があります'
    ),
});

// アカウント削除用スキーマ
export const accountDeleteRequestSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
});

// TypeScript型定義
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type AccountDeleteRequestFormData = z.infer<typeof accountDeleteRequestSchema>;
