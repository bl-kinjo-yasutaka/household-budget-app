export function formatCurrency(amount: string | number, currency: string = 'JPY'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // 通貨に応じてロケールを決定
  const getLocale = (): string => {
    switch (currency) {
      case 'USD':
        return 'en-US';
      case 'EUR':
        return 'de-DE';
      case 'JPY':
      default:
        return 'ja-JP';
    }
  };

  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: currency,
  }).format(Math.abs(numAmount));
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}
