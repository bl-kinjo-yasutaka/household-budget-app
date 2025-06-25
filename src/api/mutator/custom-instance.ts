const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const customInstance = async <T>(
  config: RequestInit & { url: string },
  options?: RequestInit
): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const requestConfig: RequestInit = {
    ...config,
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
      ...options?.headers,
    },
  };

  const fullUrl = `${API_BASE_URL}${config.url}`;

  const response = await fetch(fullUrl, requestConfig);

  const responseData = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : response.status === 204
      ? undefined
      : await response.text();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Orvalが新しい形式では直接レスポンスデータを返すように変更された
  return responseData as T;
};
