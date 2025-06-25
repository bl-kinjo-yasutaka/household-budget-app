import { cookieAuth } from '@/src/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const customInstance = async <T>(
  config: RequestInit & { url: string; data?: unknown; params?: Record<string, unknown> },
  options?: RequestInit
): Promise<T> => {
  const token = typeof window !== 'undefined' ? cookieAuth.getToken() : null;

  // data と params を除いたリクエスト設定を作成
  const { data, params, url, ...restConfig } = config;

  const requestConfig: RequestInit = {
    ...restConfig,
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
      ...options?.headers,
    },
  };

  if (data) {
    requestConfig.body = JSON.stringify(data);
  }

  // URLパラメータを処理
  let fullUrl = `${API_BASE_URL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    if (searchParams.toString()) {
      fullUrl += `?${searchParams.toString()}`;
    }
  }

  const response = await fetch(fullUrl, requestConfig);

  const responseData = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : response.status === 204
      ? undefined
      : await response.text();

  if (!response.ok) {
    const error = {
      status: response.status,
      response: {
        data: responseData,
      },
    };
    throw error;
  }

  // Orvalが新しい形式では直接レスポンスデータを返すように変更された
  return responseData as T;
};
