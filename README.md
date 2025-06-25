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
- **フォームバリデーション**: React Hook Form + Zod
- **認証**: JWT (Cookie-based)
- **Git Hooks**: Husky + lint-staged

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

開発環境でMSWを使用する場合は、以下のコマンドで起動します：

```bash
npm run dev:msw
```

MSWはAPIリクエストをインターセプトしてモックレスポンスを返します：

- モックハンドラー: `/src/mocks/handlers.ts`
- 自動生成されたモック: `/src/api/generated/*/**.msw.ts`

### APIエンドポイント

- **認証**: `/auth/login`, `/auth/signup`
- **ユーザー**: `/user/me` (ログインユーザー情報取得)
- **カテゴリ**: `/categories`
- **取引**: `/transactions`
- **ユーザー設定**: `/user/settings`

## プロジェクト構成

```
/app                    # Next.js App Router
  /(auth)              # 認証ページグループ
    /login             # ログインページ
    /signup            # サインアップページ
  /(app)               # 認証済みページグループ
    /page.tsx          # ダッシュボード
  /layout.tsx          # ルートレイアウト
  /not-found.tsx       # 404ページ
/components            # Reactコンポーネント
  /common             # 共通コンポーネント
  /features           # 機能別コンポーネント
/src
  /api
    /generated        # Orvalで生成されたAPI関連コード
    /mutator          # カスタムfetchインスタンス
  /contexts           # React Contexts (AuthContext)
  /lib
    /cookies.ts       # Cookie管理ユーティリティ
    /schemas          # Zodスキーマ定義
  /mocks              # MSWモックハンドラー
  /providers          # Context Providers
/store                # Redux store設定
/types                # TypeScript型定義
/hooks                # カスタムフック
/utils                # ユーティリティ関数
```

## スクリプト

- `npm run dev` - 開発サーバーの起動（Turbopack使用、MSWなし）
- `npm run dev:msw` - 開発サーバーの起動（Turbopack使用、MSWあり）
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run lint` - ESLintの実行
- `npm run generate:api` - APIクライアントの生成
- `npm run generate:api:watch` - APIクライアントの自動生成（監視モード）

## 環境変数

`.env.local`ファイルを作成して以下の環境変数を設定：

```env
# APIエンドポイントのベースURL（必須）
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# MSW（Mock Service Worker）の使用可否（任意）
# 開発環境でAPIモックを使用する場合は true を設定
NEXT_PUBLIC_USE_MSW=false

# Node.js環境（自動設定）
NODE_ENV=development
```

### 環境変数の説明

- **NEXT_PUBLIC_API_URL**: バックエンドAPIのベースURL
  - 開発環境: `http://localhost:8080/api`
  - 本番環境: 実際のAPIサーバーのURL
- **NEXT_PUBLIC_USE_MSW**: MSWによるAPIモックの有効化
  - `true`: モックレスポンスを使用（APIサーバー不要）
  - `false`: 実際のAPIサーバーに接続
- **NODE_ENV**: Next.jsが自動設定（development/production）

## 開発者向け情報

### テスト用APIクライアント

開発時にAPI接続をテストするためのコンポーネントが用意されています：

```tsx
import TestApiConnection from '@/components/features/TestApiConnection';

// 使用例（開発環境のみ）
{
  process.env.NODE_ENV === 'development' && <TestApiConnection />;
}
```

### カスタムインスタンス

API呼び出しは `/src/api/mutator/custom-instance.ts` でカスタマイズされており、以下の機能があります：

- JWT認証の自動付与（Cookieから取得）
- エラーハンドリング
- レスポンス形式の統一

### 認証機能

- **JWT Cookie認証**: セキュアなトークン管理（30分有効期限、セキュリティ設定済み）
- **ユーザー状態管理**: Redux + React Query統合、DBから取得
- **APIコール最適化**: 初回ロード時/ログイン時の効率的なユーザー情報取得
- **ルートガード**: 認証状態に応じた自動リダイレクト
- **認証ページ**: `/login`（ログイン）、`/signup`（サインアップ）
- **エラーハンドリング**: 401自動ログアウト、リトライ制御

## 開発環境

### コード品質管理

このプロジェクトではコミット時とプッシュ時に自動的にコード品質チェックが実行されます：

**コミット時（pre-commit）**:

- Prettier によるコードフォーマット
- ESLint によるコード品質チェック

**プッシュ時（pre-push）**:

- ビルドの実行（型チェックを含む）

手動でフォーマット・リントを実行する場合：

```bash
# ESLintの実行
npm run lint

# Prettierでのフォーマット（lint-staged経由）
npx prettier --write "**/*.{js,jsx,ts,tsx,json,md,css}"
```

## 実装状況

### 完了済み機能

- [x] **ユーザー認証システム**
  - [x] サインアップ・ログイン機能
  - [x] JWT Cookie認証（セキュア設定）
  - [x] Redux + React Query統合
  - [x] 最適化されたAPIコールタイミング
  - [x] ルートガード・自動リダイレクト
  - [x] フォームバリデーション（Zod）

### 今後の実装予定

- [ ] 取引入力フォーム
- [ ] 取引履歴画面
- [ ] カテゴリ管理
- [ ] グラフ・チャート表示
- [ ] ユーザー設定画面
