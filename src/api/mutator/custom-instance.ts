const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const customInstance = async <T>(
  url: string,
  options?: RequestInit | AbortSignal
): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // AbortSignalの場合はsignalプロパティとして扱う
  const isAbortSignal = options instanceof AbortSignal;
  const requestOptions = isAbortSignal ? { signal: options } : (options as RequestInit);

  const config: RequestInit = {
    ...requestOptions,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...requestOptions?.headers,
    },
  };

  const fullUrl = `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, config);

  const responseData = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : response.status === 204
      ? undefined
      : await response.text();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Orvalが期待するレスポンス形式に合わせる
  return {
    data: responseData,
    status: response.status,
    headers: response.headers,
  } as T;
};
