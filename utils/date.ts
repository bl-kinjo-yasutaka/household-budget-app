/**
 * 日付関連のユーティリティ関数
 */

import type { GetTransactionsParams } from '@/src/api/generated/model';

// 日付範囲の基本型（APIパラメータと互換）
export type DateRangeParams = Pick<GetTransactionsParams, 'from' | 'to'>;

// 月別日付範囲の型
export type MonthDateRange = DateRangeParams & {
  currentMonth: number;
  currentYear: number;
};

// 年別日付範囲の型
export type YearDateRange = DateRangeParams & {
  year: number;
};

/**
 * 現在の月の日付範囲を取得
 * 月末日を正確に計算し、2月等の短い月にも対応
 */
export const getCurrentMonthDateRange = (): MonthDateRange => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // 月末日を正確に計算（翌月の0日 = 当月の最終日）
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();

  return {
    from: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
    to: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`,
    currentMonth,
    currentYear,
  };
};

/**
 * 指定年の全月日付範囲を取得
 */
export const getYearDateRange = (year?: number): YearDateRange => {
  const targetYear = year ?? new Date().getFullYear();

  return {
    from: `${targetYear}-01-01`,
    to: `${targetYear}-12-31`,
    year: targetYear,
  };
};

/**
 * 安全な日付パース
 */
export const safeDateParse = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;

  const parsed = new Date(dateStr);

  // Invalid Dateの場合はnullを返す
  if (isNaN(parsed.getTime())) return null;

  return parsed;
};
