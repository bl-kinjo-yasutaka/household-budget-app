import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  /** エラータイトル */
  title?: string;
  /** エラーメッセージ */
  message: string;
  /** エラーの種類 */
  variant?: 'default' | 'network' | 'not-found' | 'permission';
  /** 再試行ボタンのコールバック */
  onRetry?: () => void;
  /** 再試行ボタンのラベル */
  retryLabel?: string;
  /** ホームへのリンクを表示するか */
  showHomeLink?: boolean;
  /** ローディング状態（再試行中） */
  isRetrying?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 統一エラー状態コンポーネント
 *
 * @description
 * アプリケーション全体で一貫したエラー表示を提供。
 * エラーの種類に応じたアイコンとメッセージ、適切なアクションを表示。
 */
export function ErrorState({
  title,
  message,
  variant = 'default',
  onRetry,
  retryLabel = '再試行',
  showHomeLink = false,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  // バリアント別のアイコンと色を決定
  const getVariantConfig = () => {
    switch (variant) {
      case 'network':
        return {
          icon: WifiOff,
          iconColor: 'text-orange-500',
          defaultTitle: 'ネットワークエラー',
        };
      case 'not-found':
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          defaultTitle: 'データが見つかりません',
        };
      case 'permission':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-500',
          defaultTitle: '権限エラー',
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-destructive',
          defaultTitle: 'エラーが発生しました',
        };
    }
  };

  const { icon: Icon, iconColor, defaultTitle } = getVariantConfig();
  const displayTitle = title || defaultTitle;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className={`mb-4 p-3 rounded-full bg-muted`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>

        <CardTitle className="text-lg text-center mb-2">{displayTitle}</CardTitle>

        <p className="text-muted-foreground text-center mb-6 max-w-md">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button onClick={onRetry} disabled={isRetrying} variant="default">
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  再試行中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {retryLabel}
                </>
              )}
            </Button>
          )}

          {showHomeLink && (
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                ホームに戻る
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ネットワークエラー専用コンポーネント
 */
export function NetworkErrorState({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <ErrorState
      variant="network"
      message="インターネット接続を確認して、再試行してください。"
      onRetry={onRetry}
      isRetrying={isRetrying}
    />
  );
}

/**
 * データ不見つけ専用コンポーネント
 */
export function NotFoundErrorState({
  title = 'データが見つかりません',
  message,
  showHomeLink = true,
}: {
  title?: string;
  message: string;
  showHomeLink?: boolean;
}) {
  return (
    <ErrorState variant="not-found" title={title} message={message} showHomeLink={showHomeLink} />
  );
}

/**
 * 権限エラー専用コンポーネント
 */
export function PermissionErrorState({
  message = 'この操作を実行する権限がありません。',
}: {
  message?: string;
}) {
  return <ErrorState variant="permission" message={message} showHomeLink={true} />;
}
