import Cookies from 'js-cookie';
import { User } from '@/src/api/generated/model';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

// Cookie設定オプション
const cookieOptions = {
  expires: 1 / 48, // 30分 (1日 = 1, 30分 = 1/48)
  secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPS必須
  sameSite: 'strict' as const, // CSRF攻撃防止
  path: '/', // 全パスでアクセス可能
};

export const cookieAuth = {
  // トークンの取得
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
  },

  // ユーザー情報の取得
  getUser: (): User | null => {
    const userString = Cookies.get(USER_KEY);
    if (!userString) return null;

    try {
      return JSON.parse(userString) as User;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      cookieAuth.clearAuth();
      return null;
    }
  },

  // 認証情報の保存
  setAuth: (token: string, user: User): void => {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
  },

  // 認証情報のクリア
  clearAuth: (): void => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
  },

  // 認証状態の確認
  isAuthenticated: (): boolean => {
    return Boolean(cookieAuth.getToken() && cookieAuth.getUser());
  },
};
