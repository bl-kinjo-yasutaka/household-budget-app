'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  useGetUserSettings,
  usePutUserSettings,
  getGetUserSettingsQueryKey,
} from '@/src/api/generated/user-settings/user-settings';
import {
  userSettingsSchema,
  UserSettingsFormData,
  CURRENCY_OPTIONS,
  WEEKDAY_OPTIONS,
} from '@/src/lib/schemas/settings';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export function UserSettingsForm() {
  const queryClient = useQueryClient();
  const { data: userSettings, isLoading } = useGetUserSettings();
  const putUserSettings = usePutUserSettings();

  const form = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      currency: userSettings?.currency || 'JPY',
      startWeekday: userSettings?.startWeekday || 0,
    },
  });

  // データ取得後にフォームの値を更新
  React.useEffect(() => {
    if (userSettings) {
      form.reset({
        currency: userSettings.currency || 'JPY',
        startWeekday: userSettings.startWeekday || 0,
      });
    }
  }, [userSettings, form]);

  const onSubmit = async (data: UserSettingsFormData) => {
    try {
      await putUserSettings.mutateAsync({ data });

      // 設定更新後にキャッシュを無効化
      const queryKey = getGetUserSettingsQueryKey();
      await queryClient.invalidateQueries({ queryKey });

      toast.success('設定を更新しました');
    } catch (error) {
      console.error('設定更新エラー:', error);
      toast.error('設定の更新に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            アプリ設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">読み込み中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          アプリ設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 通貨設定 */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>通貨</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="通貨を選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>取引金額で使用する通貨を選択してください</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 週開始曜日設定 */}
            <FormField
              control={form.control}
              name="startWeekday"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>週の開始曜日</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                      className="grid grid-cols-2 gap-2"
                    >
                      {WEEKDAY_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`weekday-${option.value}`}
                          />
                          <FormLabel
                            htmlFor={`weekday-${option.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    週間統計やカレンダー表示で使用される週の開始曜日
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={putUserSettings.isPending} className="w-full">
              {putUserSettings.isPending ? '更新中...' : '設定を保存'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
