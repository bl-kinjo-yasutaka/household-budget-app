import { useCallback } from 'react';
import { useUserSettingsData } from '@/src/contexts/user-settings-context';
import { formatCurrency as baseCurrencyFormat } from '@/utils/format';

/**
 * ユーザー設定に基づいて通貨をフォーマットするフック
 *
 * @description
 * ユーザーの通貨設定に基づいて金額をフォーマットする。
 * 設定が未取得の場合はデフォルトでJPYを使用する。
 *
 * @returns 通貨フォーマット関数
 */
export function useFormatCurrency() {
  const { settings } = useUserSettingsData();

  const formatCurrency = useCallback(
    (amount: string | number): string => {
      // settingsが未取得の場合はデフォルト通貨を使用
      const currency = settings?.currency || 'JPY';
      return baseCurrencyFormat(amount, currency);
    },
    [settings?.currency]
  );

  return formatCurrency;
}
