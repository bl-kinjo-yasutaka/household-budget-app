import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/src/lib/logger';
import { getErrorMessage, getValidationErrors, isApiError } from '@/src/types/api';

/**
 * 統一されたエラーハンドリングフック
 *
 * @description
 * アプリケーション全体で一貫したエラーハンドリングを提供。
 * APIエラー、バリデーションエラー、ネットワークエラーを適切に分類し、
 * ユーザーフレンドリーなメッセージとログを出力する。
 */
export function useErrorHandler() {
  /**
   * エラーを適切にハンドリングして表示する
   *
   * @param error - 発生したエラー
   * @param context - エラーが発生したコンテキスト（ログ用）
   * @param options - 表示オプション
   */
  const showError = useCallback(
    (
      error: unknown,
      context?: string,
      options?: {
        /** カスタムフォールバックメッセージ */
        fallbackMessage?: string;
        /** toast表示を無効にする */
        silent?: boolean;
        /** 詳細なバリデーションエラーを表示するか */
        showValidationDetails?: boolean;
      }
    ) => {
      const fallbackMessage = options?.fallbackMessage ?? 'エラーが発生しました';

      // ログ出力（コンテキスト付き）
      if (context) {
        logger.error(`Error in ${context}:`, error);
      } else {
        logger.error('Error occurred:', error);
      }

      // silent モードの場合はtoast表示をスキップ
      if (options?.silent) {
        return;
      }

      // APIエラーの場合はバリデーションエラーも確認
      if (isApiError(error)) {
        const validationErrors = getValidationErrors(error);

        if (validationErrors && options?.showValidationDetails !== false) {
          // バリデーションエラーがある場合は詳細を表示
          const errorMessages = Object.entries(validationErrors)
            .flatMap(([field, messages]) => messages.map((msg) => `${field}: ${msg}`))
            .slice(0, 3); // 最大3件まで表示

          toast.error('入力内容をご確認ください', {
            description: errorMessages.join('\n'),
          });
          return;
        }
      }

      // 一般的なエラーメッセージを表示
      const message = getErrorMessage(error, fallbackMessage);

      // ネットワークエラーの特別処理
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('ネットワークエラー', {
          description: 'インターネット接続を確認してください',
        });
        return;
      }

      // 認証エラーの特別処理
      if (isApiError(error) && error.status === 401) {
        toast.error('認証エラー', {
          description: 'ログインが必要です',
        });
        return;
      }

      // 通常のエラーメッセージ表示
      toast.error(message);
    },
    []
  );

  /**
   * 成功メッセージを表示する
   *
   * @param message - 成功メッセージ
   * @param description - 詳細説明（オプション）
   */
  const showSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, description ? { description } : undefined);
  }, []);

  /**
   * 情報メッセージを表示する
   *
   * @param message - 情報メッセージ
   * @param description - 詳細説明（オプション）
   */
  const showInfo = useCallback((message: string, description?: string) => {
    toast.info(message, description ? { description } : undefined);
  }, []);

  return {
    showError,
    showSuccess,
    showInfo,
  };
}
