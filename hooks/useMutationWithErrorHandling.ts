import { useMutation, MutationFunction, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';

/**
 * エラーハンドリングが統一されたmutationフック
 *
 * @description
 * React QueryのuseMutationをラップし、統一されたエラーハンドリング、
 * 成功メッセージ表示、キャッシュ無効化を提供する。
 */
export function useMutationWithErrorHandling<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  options: {
    /** 成功時のコールバック */
    onSuccess?: (data: TData, variables: TVariables) => void;
    /** 成功メッセージ */
    successMessage?: string;
    /** 成功時の詳細説明 */
    successDescription?: string;
    /** エラーコンテキスト（ログ用） */
    errorContext?: string;
    /** エラー時のフォールバックメッセージ */
    errorFallbackMessage?: string;
    /** 無効化するクエリキー */
    invalidateQueries?: string[];
    /** バリデーションエラーの詳細を表示するか */
    showValidationDetails?: boolean;
    /** 処理完了時のコールバック（成功・失敗問わず） */
    onSettled?: () => void;
  } = {}
) {
  const { showError, showSuccess } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      // 成功メッセージを表示
      if (options.successMessage) {
        showSuccess(options.successMessage, options.successDescription);
      }

      // キャッシュ無効化
      if (options.invalidateQueries) {
        await Promise.all(
          options.invalidateQueries.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey: [queryKey] })
          )
        );
      }

      // カスタム成功処理
      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      showError(error, options.errorContext, {
        fallbackMessage: options.errorFallbackMessage,
        showValidationDetails: options.showValidationDetails,
      });
    },
    onSettled: () => {
      options.onSettled?.();
    },
  });
}

/**
 * よく使用されるmutationパターンのプリセット
 */
export const mutationPresets = {
  /**
   * 作成処理用のプリセット
   */
  create: (resourceName: string, queryKey: string) => ({
    successMessage: `${resourceName}を作成しました`,
    errorContext: `${resourceName} creation`,
    errorFallbackMessage: `${resourceName}の作成に失敗しました`,
    invalidateQueries: [queryKey],
    showValidationDetails: true,
  }),

  /**
   * 更新処理用のプリセット
   */
  update: (resourceName: string, queryKey: string, id?: number | string) => ({
    successMessage: `${resourceName}を更新しました`,
    errorContext: `${resourceName} update`,
    errorFallbackMessage: `${resourceName}の更新に失敗しました`,
    invalidateQueries: id ? [queryKey, `${queryKey}/${id}`] : [queryKey],
    showValidationDetails: true,
  }),

  /**
   * 削除処理用のプリセット
   */
  delete: (resourceName: string, queryKey: string) => ({
    successMessage: `${resourceName}を削除しました`,
    errorContext: `${resourceName} deletion`,
    errorFallbackMessage: `${resourceName}の削除に失敗しました`,
    invalidateQueries: [queryKey],
    showValidationDetails: false,
  }),

  /**
   * 認証処理用のプリセット
   */
  auth: (action: 'login' | 'logout' | 'signup') => {
    const actionMap = {
      login: 'ログイン',
      logout: 'ログアウト',
      signup: 'アカウント作成',
    };

    return {
      successMessage: `${actionMap[action]}しました`,
      errorContext: `auth ${action}`,
      errorFallbackMessage: `${actionMap[action]}に失敗しました`,
      showValidationDetails: action !== 'logout',
    };
  },
} as const;
