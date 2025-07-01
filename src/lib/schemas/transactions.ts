import { z } from 'zod';

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: '収入・支出を選択してください' }),
  categoryId: z.coerce.number({ required_error: 'カテゴリを選択してください' }),
  transDate: z.string().min(1, '取引日を入力してください'),
  amount: z.coerce
    .number()
    .int('金額は整数で入力してください')
    .min(1, '金額は1円以上で入力してください')
    .max(999999999, '金額が大きすぎます'),
  memo: z.string().max(500, 'メモは500文字以内で入力してください').nullable().optional(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
