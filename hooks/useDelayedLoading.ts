import { useState, useEffect } from 'react';

/**
 * 遅延ローディング表示フック
 *
 * @description
 * 短時間のローディング状態ではローディングUIを表示せず、
 * 指定した遅延時間後にローディング表示を開始する。
 * ローディングのちらつきを防ぎ、UXを向上させる。
 *
 * @param isLoading - 実際のローディング状態
 * @param delay - ローディング表示開始までの遅延時間（ミリ秒）
 * @returns 遅延されたローディング状態
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useQuery(...);
 * const showLoading = useDelayedLoading(isLoading, 300);
 *
 * if (showLoading) {
 *   return <LoadingSkeleton variant="table" />;
 * }
 *
 * return <DataTable data={data} />;
 * ```
 */
export function useDelayedLoading(isLoading: boolean, delay: number = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // ローディング開始時：遅延後にローディング表示
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // ローディング終了時：即座にローディング非表示
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  return showLoading;
}
