'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  putUserSettings,
  getGetUserSettingsQueryKey,
} from '@/src/api/generated/user-settings/user-settings';
import {
  userSettingsSchema,
  UserSettingsFormData,
  CURRENCY_OPTIONS,
  WEEKDAY_OPTIONS,
} from '@/src/lib/schemas/settings';
import { Settings } from 'lucide-react';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { NetworkErrorState } from '@/components/ui/error-state';
import {
  useMutationWithErrorHandling,
  mutationPresets,
} from '@/hooks/useMutationWithErrorHandling';

/**
 * ユーザー設定フォームコンポーネント
 *
 * @description
 * ユーザーの基本設定（通貨、週開始曜日）を管理するフォーム。
 * 設定変更はアプリケーション全体に即座に反映される。
 *
 * @features
 * - 通貨設定（JPY/USD/EUR）の選択
 * - 週開始曜日の設定
 * - フォームバリデーション
 * - 楽観的更新とキャッシュ無効化
 */
export function UserSettingsForm() {
  const { data: userSettings, isLoading, error, refetch } = useGetUserSettings();

  const updateUserSettings = useMutationWithErrorHandling(
    (data: { data: UserSettingsFormData }) => putUserSettings(data.data),
    {
      ...mutationPresets.update('設定', '/user-settings'),
      invalidateQueries: [getGetUserSettingsQueryKey()[0]],
    }
  );

  const form = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      currency: userSettings?.currency || 'JPY',
      startWeekday: userSettings?.startWeekday || 0,
    },
  });

  // データ取得後にフォームの値を更新（フォームがダーティでない場合のみ）
  useEffect(() => {
    if (userSettings && !form.formState.isDirty) {
      form.reset({
        currency: userSettings.currency || 'JPY',
        startWeekday: userSettings.startWeekday || 0,
      });
    }
  }, [userSettings, form, form.formState.isDirty]);

  const onSubmit = (data: UserSettingsFormData) => {
    updateUserSettings.mutate({ data });
  };

  const showLoading = useDelayedLoading(isLoading, 200);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            アプリ設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkErrorState onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  if (showLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            アプリ設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator variant="spinner" height="h-40" />
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

            <Button type="submit" disabled={updateUserSettings.isPending} className="w-full">
              {updateUserSettings.isPending ? '更新中...' : '設定を保存'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
