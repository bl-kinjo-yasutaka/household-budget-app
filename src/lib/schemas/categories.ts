import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名を入力してください')
    .max(50, 'カテゴリ名は50文字以内で入力してください'),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '有効な色コード（#RRGGBB）を入力してください'),
  type: z.enum(['income', 'expense'], { required_error: 'カテゴリタイプを選択してください' }),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
