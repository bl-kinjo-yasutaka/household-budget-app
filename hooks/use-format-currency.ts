import { useCallback } from 'react';
import { useUserSettings } from '@/src/contexts/user-settings-context';
import { formatCurrency as baseCurrencyFormat } from '@/utils/format';

export function useFormatCurrency() {
  const { settings } = useUserSettings();

  const formatCurrency = useCallback(
    (amount: string | number): string => {
      // ローディング中またはsettingsが未取得の場合はデフォルト通貨を使用
      const currency = settings?.currency || 'JPY';
      return baseCurrencyFormat(amount, currency);
    },
    [settings?.currency]
  );

  return formatCurrency;
}
