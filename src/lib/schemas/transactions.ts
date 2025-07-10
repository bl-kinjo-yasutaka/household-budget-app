import { z } from 'zod';

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: '収入・支出を選択してください' }),
  categoryId: z.coerce.number({ required_error: 'カテゴリを選択してください' }),
  transDate: z.string().min(1, '取引日を入力してください'),
  amount: z.preprocess(
    (val) => {
      // 空文字、null、undefinedの場合はundefinedを返す
      if (val === '' || val === null || val === undefined) {
        return undefined;
      }
      // 数値変換を試みる
      const parsed = Number(val);
      return isNaN(parsed) ? val : parsed;
    },
    z
      .number({
        required_error: '金額を入力してください',
        invalid_type_error: '有効な数値を入力してください',
      })
      .int('金額は整数で入力してください')
      .min(1, '金額は1円以上で入力してください')
      .max(999999999, '金額が大きすぎます')
  ),
  memo: z.string().max(500, 'メモは500文字以内で入力してください').nullable().optional(),
});

// 入力時の型（amount は string | number | ''）
export type TransactionFormInput = z.input<typeof transactionFormSchema>;
// 出力時の型（amount は number）
export type TransactionFormData = z.output<typeof transactionFormSchema>;
