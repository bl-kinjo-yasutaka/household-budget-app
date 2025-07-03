/**
 * 統一ログシステム
 *
 * @description
 * アプリケーション全体で使用する統一されたログ出力機能。
 * 開発環境でのみコンソール出力し、本番環境では適切な処理を行う。
 */

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

/**
 * ログ出力の基本関数
 */
function logMessage(level: LogLevel, message: string, ...args: unknown[]) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const timestamp = new Date().toISOString();

  if (isDevelopment) {
    // 開発環境でのみコンソール出力
    switch (level) {
      case 'ERROR':
        console.error(`[${timestamp}] ERROR:`, message, ...args);
        break;
      case 'WARN':
        console.warn(`[${timestamp}] WARN:`, message, ...args);
        break;
      case 'INFO':
        console.info(`[${timestamp}] INFO:`, message, ...args);
        break;
      case 'DEBUG':
        console.debug(`[${timestamp}] DEBUG:`, message, ...args);
        break;
    }
  } else {
    // 本番環境では外部ログサービスに送信（将来実装）
    // TODO: 本番環境でのログ送信実装
    if (level === 'ERROR') {
      // エラーレベルのみ本番でも記録
      console.error(`[${timestamp}] ERROR:`, message);
    }
  }
}

/**
 * 統一ログシステムのエクスポート
 */
export const logger = {
  /**
   * エラーログ出力
   */
  error: (message: string, ...args: unknown[]) => {
    logMessage('ERROR', message, ...args);
  },

  /**
   * 警告ログ出力
   */
  warn: (message: string, ...args: unknown[]) => {
    logMessage('WARN', message, ...args);
  },

  /**
   * 情報ログ出力
   */
  info: (message: string, ...args: unknown[]) => {
    logMessage('INFO', message, ...args);
  },

  /**
   * デバッグログ出力
   */
  debug: (message: string, ...args: unknown[]) => {
    logMessage('DEBUG', message, ...args);
  },
};

export default logger;
