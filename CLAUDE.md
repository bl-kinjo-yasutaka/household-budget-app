# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) に指針を提供します。

## 注意事項

このファイルには以下の項目のみを記載し、新しい項目の追加は行わないこと：

- 概要
- 技術スタック
- コマンド
- プロジェクト構成
- デザインガイドライン
- 実装履歴の活用

内容の更新のみを行い、項目の追加は避けること。

## 概要

Next.js 15.3のApp Routerアーキテクチャを使用して構築された日本の家計簿管理アプリケーション（家計簿アプリ）です。

## 技術スタック

- **Next.js 15.3** App RouteとTurbopack対応
- **React 19** TypeScript 5対応
- **Redux Toolkit** 状態管理
- **Tailwind CSS v4** スタイリング
- **shadcn/ui + Radix UI** UIコンポーネントライブラリ
- **Lucide React** アイコンライブラリ
- **React Query (TanStack Query)** APIクライアント
- **MSW (Mock Service Worker)** APIモック
- **Orval** コード生成
- **React Hook Form + Zod** フォームバリデーション
- **js-cookie** Cookie管理
- **ESLint** コード品質管理
- **Prettier** コードフォーマッター
- **Husky + lint-staged** Git Hooks管理

## コマンド

### 開発用

- `npm run dev` - Turbopackを使用した開発サーバーの起動（MSWなし、http://localhost:3000）
- `npm run dev:msw` - Turbopackを使用した開発サーバーの起動（MSWあり、http://localhost:3000）
- `npm run build` - 本番用アプリケーションのビルド
- `npm run start` - 本番サーバーの起動
- `npm run lint` - ESLintを実行してコード品質をチェック
- `npm run generate:api` - APIクライアントと型の生成
- `npm run generate:api:watch` - APIクライアントの自動生成（監視モード）

### Git Hooks（自動実行）

- **pre-commit**: lint-stagedによるフォーマットとリント
- **pre-push**: ビルドの実行

## プロジェクト構成

- `/app` - Next.js App Routerのページとレイアウト
  - `/(auth)` - 認証ページグループ（未認証ユーザー用）
    - `/login/page.tsx` - ログインページ
    - `/signup/page.tsx` - サインアップページ
    - `layout.tsx` - 認証レイアウト（自動リダイレクト機能付き）
  - `/(app)` - 認証済みページグループ
    - `page.tsx` - ダッシュボードページ（統計カード・グラフ表示）
    - `layout.tsx` - アプリレイアウト（レスポンシブNavigation付き、ルートガード機能）
    - `/transactions` - 取引関連ページ群
    - `/categories` - カテゴリ管理ページ
    - `/settings` - 設定ページ
  - `layout.tsx` - ルートレイアウト（全Provider設定）
  - `not-found.tsx` - 404エラーページ
- `/components` - タイプ別に整理されたReactコンポーネント
  - `/ui` - shadcn/ui UIコンポーネント
  - `/common` - 共有コンポーネント（Navigation）
  - `/features` - 機能固有のコンポーネント
- `/src` - アプリケーションのコアロジック
  - `/api/generated` - Orvalで生成されたAPI関連コード
  - `/api/mutator` - カスタムfetchインスタンス（Cookie認証対応）
  - `/contexts` - React Contexts
    - `auth-context.tsx` - 認証状態管理
  - `/lib` - ライブラリユーティリティ
    - `utils.ts` - shadcn/ui ユーティリティ関数
    - `cookies.ts` - Cookie管理ユーティリティ
    - `/schemas` - Zodスキーマ定義
      - `auth.ts` - 認証関連スキーマ
      - `index.ts` - バレルエクスポート
  - `/mocks` - MSWモックハンドラー
  - `/providers` - Context Providers
- `/store` - Redux状態管理
  - `index.ts` - TypeScript型付きのstore設定
  - `provider.tsx` - クライアントサイドRedux Providerラッパー
  - `/slices/appSlice.ts` - 基本的なアプリ状態のslice
- `/types` - TypeScript型定義
- `/hooks` - カスタムReactフック
- `/utils` - ユーティリティ関数
- `/_docs` - ログ管理

## デザインガイドライン

### UI/UXの基本方針

- **デザインコンセプト**: シンプルで使いやすい、家計簿らしい親しみやすさ
- **ターゲット**: 若年層、ITリテラシー低〜中レベル
- **参考デザイン**: https://beanslabo.co.jp/ のクリーンでモダンなアプローチ

### カラーパレット

- **メインカラー**: 緑系（#059669 - 家計簿・金融アプリらしい色）
- **背景**: #fafafa（やわらかい白）
- **カード**: #ffffff（純白）
- **テキスト**: #0f172a（濃いグレー、読みやすさ重視）
- **セカンダリ**: #f1f5f9（薄いグレー）

### レイアウト原則

1. **カードベースUI**: 全ての主要コンテンツはshadcn/ui Cardで統一
2. **レスポンシブファースト**: モバイル→デスクトップの順で設計
3. **適切な余白**: container mx-auto px-4 py-6を基本とする
4. **グリッドレイアウト**: gap-4, md:grid-cols-2, lg:grid-cols-3を活用

### コンポーネント設計

- **UIライブラリ**: shadcn/ui + Radix UIを必ず使用
- **アイコン**: Lucide Reactを使用（絵文字は使わない）
- **ボタン**: shadcn/ui Buttonの variant, size を適切に使い分け
- **フォーム**: React Hook Form + Zod + shadcn/ui Input

### ナビゲーション

- **デスクトップ**: 上部ナビゲーション（サイドバーは使わない）
- **モバイル**: ハンバーガーメニュー（Sheet コンポーネント）
- **ユーザー表示**: アバター（頭文字） + 名前 + メール

### 一貫性の確保

- **ページヘッダー**: title + description + 主要アクション の統一フォーマット
- **空状態**: アイコン + タイトル + 説明 + アクション の統一パターン
- **エラー・成功**: 適切なvariant（destructive, default等）の使用

## 実装履歴の活用

- **起動時の必須作業**: `/_docs`配下の全実装ログファイルを読み込む
- **把握すべき内容**: 過去の実装内容、設計判断、問題と解決方法
- **目的**: プロジェクトの経緯を理解し、一貫性のある提案・実装を行う
