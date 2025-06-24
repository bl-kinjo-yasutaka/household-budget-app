# 家計簿アプリ (Household Budget App)

Next.js 15を使用した家計簿管理アプリケーションのフロントエンド実装です。

## 技術スタック

- **フレームワーク**: Next.js 15.3 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v4
- **状態管理**: Redux Toolkit
- **APIクライアント**: React Query (TanStack Query)
- **APIモック**: MSW (Mock Service Worker)
- **コード生成**: Orval

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## API開発

このプロジェクトはOpenAPI仕様書からAPIクライアントと型を自動生成します。

### API型の生成

OpenAPI仕様書（`../household-budget-api/specs/expense-api.yaml`）からAPIクライアントを生成：

```bash
npm run generate:api
```

変更を監視して自動生成：

```bash
npm run generate:api:watch
```

### MSWによるモック

開発環境では、MSW（Mock Service Worker）が自動的に起動し、APIリクエストをインターセプトしてモックレスポンスを返します。

- モックハンドラー: `/src/mocks/handlers.ts`
- 自動生成されたモック: `/src/api/generated/*/**.msw.ts`

### APIエンドポイント

- **認証**: `/auth/login`, `/auth/signup`
- **カテゴリ**: `/categories`
- **取引**: `/transactions`
- **ユーザー設定**: `/user/settings`

## プロジェクト構成

```
/app                    # Next.js App Router
  /layout.tsx          # ルートレイアウト
  /page.tsx            # ダッシュボード
/components            # Reactコンポーネント
  /common             # 共通コンポーネント
  /features           # 機能別コンポーネント
/src
  /api
    /generated        # Orvalで生成されたAPI関連コード
    /mutator          # カスタムfetchインスタンス
  /mocks              # MSWモックハンドラー
  /providers          # Context Providers
/store                # Redux store設定
/types                # TypeScript型定義
/hooks                # カスタムフック
/utils                # ユーティリティ関数
```

## スクリプト

- `npm run dev` - 開発サーバーの起動（Turbopack使用）
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run lint` - ESLintの実行
- `npm run generate:api` - APIクライアントの生成
- `npm run generate:api:watch` - APIクライアントの自動生成（監視モード）

## 環境変数

`.env.local`ファイルを作成して以下の環境変数を設定：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 開発者向け情報

### テスト用APIクライアント

開発時にAPI接続をテストするためのコンポーネントが用意されています：

```tsx
import TestApiConnection from "@/components/features/TestApiConnection";

// 使用例（開発環境のみ）
{process.env.NODE_ENV === 'development' && <TestApiConnection />}
```

### カスタムインスタンス

API呼び出しは `/src/api/mutator/custom-instance.ts` でカスタマイズされており、以下の機能があります：

- JWT認証の自動付与
- エラーハンドリング
- レスポンス形式の統一

## 今後の実装予定

- [ ] ユーザー認証フロー
- [ ] 取引入力フォーム
- [ ] 取引履歴画面
- [ ] カテゴリ管理
- [ ] グラフ・チャート表示
- [ ] 設定画面
