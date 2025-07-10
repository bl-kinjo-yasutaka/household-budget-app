'use client';

import { useFormContext } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import type { CategoryFormData } from '@/src/lib/schemas/categories';

// 事前定義色パレット
export const PRESET_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  '#64748b', // slate-500
];

interface CategoryFormContentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
  isEditing: boolean;
}

export function CategoryFormContent({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  isEditing,
}: CategoryFormContentProps) {
  // useFormContextでフォームインスタンスを取得
  const form = useFormContext<CategoryFormData>();
  // フォーム値をSingle Source of Truthとして使用
  const currentColor = form.watch('colorHex') || PRESET_COLORS[0];

  const handleColorSelect = (color: string) => {
    form.setValue('colorHex', color);
    // プリセットボタンはInputフィールドを経由しないため、バリデーションを手動実行
    form.trigger('colorHex');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'カテゴリを編集' : '新しいカテゴリを作成'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'カテゴリの名前、色、タイプを変更できます。'
              : '取引を分類するためのカテゴリを作成します。'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* カテゴリ名 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 食費、交通費" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* タイプ選択 */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>タイプ</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">支出</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">収入</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* カラーピッカー */}
            <FormField
              control={form.control}
              name="colorHex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ色</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* 選択中の色プレビュー */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentColor }}
                        ></div>
                        <Input
                          {...field}
                          placeholder="#3b82f6"
                          className="font-mono"
                          disabled={isLoading}
                        />
                      </div>

                      {/* 事前定義色パレット */}
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          プリセット色から選択
                        </Label>
                        <div className="grid grid-cols-9 gap-2 mt-2">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                                currentColor === color
                                  ? 'border-foreground shadow-md'
                                  : 'border-border'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorSelect(color)}
                              disabled={isLoading}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '保存中...' : isEditing ? 'カテゴリを更新' : 'カテゴリを作成'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
