'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { transactionFormSchema, type TransactionFormData } from '@/src/lib/schemas/transactions';
import {
  usePostTransactions,
  usePutTransactionsId,
  useDeleteTransactionsId,
} from '@/src/api/generated/transactions/transactions';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyState } from '@/components/common/empty-state';
import type { Transaction, Category } from '@/src/api/generated/model';

interface TransactionFormTabsProps {
  transaction?: Transaction;
  categories: Category[];
}

export function TransactionFormTabs({ transaction, categories }: TransactionFormTabsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const createMutation = usePostTransactions({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/transactions'] });
        router.push('/transactions');
      },
      onError: (error) => {
        console.error('取引の作成に失敗しました:', error);
        setError('取引の作成に失敗しました。もう一度お試しください。');
      },
    },
  });

  const updateMutation = usePutTransactionsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/transactions'] });
        queryClient.invalidateQueries({ queryKey: [`/transactions/${transaction?.id}`] });
        router.push('/transactions');
      },
      onError: (error) => {
        console.error('取引の更新に失敗しました:', error);
        setError('取引の更新に失敗しました。もう一度お試しください。');
      },
    },
  });

  const deleteMutation = useDeleteTransactionsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/transactions'] });
        router.push('/transactions');
      },
      onError: (error) => {
        console.error('取引の削除に失敗しました:', error);
        setError('取引の削除に失敗しました。もう一度お試しください。');
      },
      onSettled: () => {
        setIsDeleting(false);
      },
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

  const onSubmit = async (data: TransactionFormData) => {
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
    } else if (mode === 'edit' && transaction) {
      updateMutation.mutate({
        id: transaction.id!,
        data: {
          categoryId: data.categoryId,
          type: data.type,
          transDate: data.transDate,
          amount,
          memo: data.memo || null,
        },
      });
    }
  };

  const handleDelete = () => {
    if (transaction && window.confirm('この取引を削除してもよろしいですか？')) {
      setIsDeleting(true);
      deleteMutation.mutate({ id: transaction.id! });
    }
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
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === 'create' ? '収支入力' : '取引編集'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create' ? '新しい取引を記録します' : '取引情報を編集します'}
          </p>
        </div>
      </div>

      {/* Form */}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 収入・支出タブ */}
            <div className="space-y-2">
              <Label>取引タイプ</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedType === 'income' ? 'default' : 'outline'}
                  className="flex-1"
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
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id!.toString()}>
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
                  onClick={handleDelete}
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
    </div>
  );
}
