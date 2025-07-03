import { z } from 'zod';

/**
 * 通貨選択肢の定数配列
 *
 * @description
 * アプリケーションでサポートする通貨の選択肢を定義。
 * 表示用のラベル（記号付き）と内部で使用する通貨コードを含む。
 */
export const CURRENCY_OPTIONS = [
  { label: '日本円 (¥)', value: 'JPY' },
  { label: '米ドル ($)', value: 'USD' },
  { label: 'ユーロ (€)', value: 'EUR' },
] as const;

/**
 * 週開始曜日選択肢の定数配列
 *
 * @description
 * 週間統計やカレンダー表示で使用する週開始曜日の選択肢。
 * JavaScript標準のDate.getDay()の値（0=日曜日〜6=土曜日）に対応。
 */
export const WEEKDAY_OPTIONS = [
  { label: '日曜日', value: 0 },
  { label: '月曜日', value: 1 },
  { label: '火曜日', value: 2 },
  { label: '水曜日', value: 3 },
  { label: '木曜日', value: 4 },
  { label: '金曜日', value: 5 },
  { label: '土曜日', value: 6 },
] as const;

/**
 * ユーザー設定フォーム用バリデーションスキーマ
 *
 * @description
 * 通貨設定と週開始曜日の設定を検証するZodスキーマ。
 * フォームの入力値検証とAPIリクエストデータの検証に使用。
 */
export const userSettingsSchema = z.object({
  currency: z.string().max(3, '通貨コードは3文字以内で入力してください'),
  startWeekday: z
    .number()
    .min(0, '週開始曜日は0-6の間で選択してください')
    .max(6, '週開始曜日は0-6の間で選択してください'),
});

/**
 * パスワード変更フォーム用バリデーションスキーマ
 *
 * @description
 * パスワード変更フォームの入力値を検証するZodスキーマ。
 * 現在のパスワード、新しいパスワード、確認用パスワードを含む。
 * 既存ユーザーとの整合性のため、認証機能と同じ条件（8文字以上のみ）を適用。
 *
 * @validation
 * - 新しいパスワード: 8文字以上、191文字以内
 * - 確認パスワード: 新しいパスワードと一致する必要がある
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(191, 'パスワードは191文字以内で入力してください'),
    confirmPassword: z.string().min(1, 'パスワード確認を入力してください'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

/**
 * パスワード変更API用リクエストスキーマ
 *
 * @description
 * パスワード変更APIに送信するデータを検証するZodスキーマ。
 * フォーム用スキーマから確認用パスワードを除いたもの。
 * 認証機能と統一された条件を適用。
 */
export const passwordChangeRequestSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(191, 'パスワードは191文字以内で入力してください'),
});

/**
 * アカウント削除リクエスト用バリデーションスキーマ
 *
 * @description
 * アカウント削除時の本人確認用パスワード入力を検証するZodスキーマ。
 * セキュリティのため現在のパスワードの入力を必須とする。
 */
export const accountDeleteRequestSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
});

// TypeScript型定義

/**
 * ユーザー設定フォームデータの型定義
 *
 * @description
 * userSettingsSchemaから自動生成される型定義。
 * ユーザー設定フォームのデータ構造を表す。
 */
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;

/**
 * パスワード変更フォームデータの型定義
 *
 * @description
 * passwordChangeSchemaから自動生成される型定義。
 * パスワード変更フォームのデータ構造を表す。
 * 確認用パスワードフィールドを含む。
 */
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * アカウント削除リクエストデータの型定義
 *
 * @description
 * accountDeleteRequestSchemaから自動生成される型定義。
 * アカウント削除リクエストのデータ構造を表す。
 */
export type AccountDeleteRequestFormData = z.infer<typeof accountDeleteRequestSchema>;
