'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { transactionFormSchema, type TransactionFormData } from '@/src/lib/schemas/transactions';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import type { Transaction, Category } from '@/src/api/generated/model';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/api/useTransactions';

interface TransactionFormTabsProps {
  transaction?: Transaction;
  categories: Category[];
}

export function TransactionFormTabs({ transaction, categories }: TransactionFormTabsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: confirmDialog, showConfirmation, hideConfirmation } = useConfirmationDialog();

  const mode = transaction ? 'edit' : 'create';

  // Determine initial values from transaction data
  const initialValues = useMemo((): TransactionFormData => {
    if (!transaction) {
      // For new transactions, use the first category of the default type
      const defaultType: 'income' | 'expense' = 'expense';
      const defaultCategoryId = categories.find((cat) => cat.type === defaultType)?.id || 0;

      return {
        type: defaultType,
        categoryId: defaultCategoryId,
        transDate: new Date().toISOString().split('T')[0],
        amount: 0,
        memo: '',
      };
    }

    return {
      type: transaction.type || 'expense',
      categoryId:
        transaction.categoryId ||
        categories.find((cat) => cat.type === (transaction.type || 'expense'))?.id ||
        0,
      transDate: transaction.transDate || '',
      amount: transaction.amount || 0,
      memo: transaction.memo || '',
    };
  }, [transaction, categories]);

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction(transaction?.id);
  const deleteMutation = useDeleteTransaction({
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialValues,
  });

  const selectedType = watch('type');
  const selectedCategoryId = watch('categoryId');

  // タイプに応じてカテゴリをフィルタリング
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) => category.type === selectedType);
  }, [categories, selectedType]);

  const handleSubmitConfirmation = (data: TransactionFormData) => {
    const actionText = mode === 'create' ? '作成' : '更新';
    const typeText = data.type === 'income' ? '収入' : '支出';

    showConfirmation({
      title: `取引を${actionText}します`,
      description: `この${typeText}取引を${actionText}してもよろしいですか？`,
      onConfirm: () => executeSubmit(data),
    });
  };

  const executeSubmit = async (data: TransactionFormData) => {
    // Clear any previous errors
    setError(null);

    // Amount is stored as positive number, type determines income/expense
    const amount = data.amount;

    if (mode === 'create') {
      createMutation.mutate({
        data: {
          categoryId: data.categoryId,
          type: data.type,
          transDate: data.transDate,
          amount,
          memo: data.memo || null,
        },
      });
    } else if (mode === 'edit' && transaction?.id) {
      updateMutation.mutate({
        id: transaction.id,
        data: {
          categoryId: data.categoryId,
          type: data.type,
          transDate: data.transDate,
          amount,
          memo: data.memo || null,
        },
      });
    }

    // 処理開始後にモーダルを閉じる
    hideConfirmation();
  };

  const handleDeleteConfirmation = () => {
    showConfirmation(
      {
        title: '取引を削除します',
        description: 'この取引を削除してもよろしいですか？この操作は取り消せません。',
        onConfirm: () => {
          if (transaction?.id) {
            setIsDeleting(true);
            deleteMutation.mutate({ id: transaction.id });
            hideConfirmation();
          }
        },
      },
      { variant: 'destructive' }
    );
  };

  // Check if filtered categories are available for the selected type
  if (filteredCategories.length === 0) {
    return (
      <EmptyState
        title={mode === 'create' ? '収支入力' : '取引編集'}
        description={`${selectedType === 'income' ? '収入' : '支出'}カテゴリが登録されていません。`}
        actionLabel="カテゴリ管理へ"
        actionHref="/categories"
        showBackButton={true}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">取引情報</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(handleSubmitConfirmation)} className="space-y-6">
            {/* 収入・支出タブ */}
            <div className="space-y-2">
              <Label>取引タイプ</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedType === 'income' ? 'default' : 'outline'}
                  className="flex-1"
                  data-testid="income-tab"
                  onClick={() => {
                    setValue('type', 'income');
                    // Set first available category for income
                    const firstIncomeCategory = categories.find((cat) => cat.type === 'income');
                    if (firstIncomeCategory?.id !== undefined) {
                      setValue('categoryId', firstIncomeCategory.id);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  収入
                </Button>
                <Button
                  type="button"
                  variant={selectedType === 'expense' ? 'default' : 'outline'}
                  className="flex-1"
                  data-testid="expense-tab"
                  onClick={() => {
                    setValue('type', 'expense');
                    // Set first available category for expense
                    const firstExpenseCategory = categories.find((cat) => cat.type === 'expense');
                    if (firstExpenseCategory?.id !== undefined) {
                      setValue('categoryId', firstExpenseCategory.id);
                    }
                  }}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  支出
                </Button>
              </div>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            {/* 取引日 */}
            <div className="space-y-2">
              <Label htmlFor="transDate">取引日</Label>
              <Input
                id="transDate"
                type="date"
                {...register('transDate')}
                className={errors.transDate ? 'border-red-500' : ''}
              />
              {errors.transDate && (
                <p className="text-sm text-red-500">{errors.transDate.message}</p>
              )}
            </div>

            {/* 金額 */}
            <div className="space-y-2">
              <Label htmlFor="amount">金額</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                step="1"
                min="1"
                {...register('amount')}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              <p className="text-sm text-muted-foreground">1円以上の整数で入力してください</p>
            </div>

            {/* カテゴリ */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">カテゴリ</Label>
              <Select
                key={`category-select-${mode}-${transaction?.id || 'new'}-${selectedType}`}
                value={selectedCategoryId?.toString() || ''}
                onValueChange={(value) => {
                  setValue('categoryId', parseInt(value));
                }}
              >
                <SelectTrigger data-testid="category-select">
                  <SelectValue placeholder="カテゴリを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id!.toString()}
                      data-testid="category-option"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            {/* メモ */}
            <div className="space-y-2">
              <Label htmlFor="memo">メモ</Label>
              <Input
                id="memo"
                type="text"
                placeholder="取引の詳細を入力してください（任意）"
                {...register('memo')}
                className={errors.memo ? 'border-red-500' : ''}
              />
              {errors.memo && <p className="text-sm text-red-500">{errors.memo.message}</p>}
            </div>

            {/* Actions */}
            <div className={`flex pt-4 ${mode === 'edit' ? 'justify-between' : 'justify-end'}`}>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteConfirmation}
                  disabled={isDeleting}
                  className="min-w-[100px]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? '削除中...' : '削除'}
                </Button>
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/transactions">キャンセル</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <ConfirmationDialog
          open={true}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
          onCancel={hideConfirmation}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          isLoading={isSubmitting || isDeleting}
        />
      )}
    </>
  );
}
