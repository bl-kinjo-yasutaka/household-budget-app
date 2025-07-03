/**
 * API関連の型定義
 */

// APIエラーレスポンスの型定義
export interface ApiError {
  status: number;
  response: {
    data: {
      message: string;
      errors?: Record<string, string[]>;
      code?: string;
    };
  };
}

// APIエラーかどうかを判定するタイプガード
export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  // 型アサーションの代わりにプロパティ存在チェックを使用
  if (!('response' in error) || typeof error.response !== 'object' || error.response === null) {
    return false;
  }

  const response = error.response;
  if (!('data' in response) || typeof response.data !== 'object' || response.data === null) {
    return false;
  }

  const data = response.data;
  return 'message' in data && typeof data.message === 'string';
}

// APIエラーからメッセージを安全に取得するヘルパー関数
export function getErrorMessage(error: unknown, fallback = 'エラーが発生しました'): string {
  if (isApiError(error)) {
    return error.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

// バリデーションエラーを取得するヘルパー関数
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isApiError(error) && error.response.data.errors) {
    return error.response.data.errors;
  }
  return null;
}
