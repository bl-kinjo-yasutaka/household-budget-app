import Cookies from 'js-cookie';

const TOKEN_KEY = 'access_token';

// Cookie設定オプション
const cookieOptions = {
  expires: 1, // 1日 (セッションの有効期限を延長してUXを改善)
  secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPS必須
  sameSite: 'strict' as const, // CSRF攻撃防止
  path: '/', // 全パスでアクセス可能
};

export const cookieAuth = {
  // トークンの取得
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
  },

  // トークンの保存
  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },

  // トークンのクリア
  clearToken: (): void => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
  },

  // 認証状態の確認（トークンの存在のみチェック）
  isAuthenticated: (): boolean => {
    return Boolean(cookieAuth.getToken());
  },
};
