# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) に指針を提供します。

## コマンド

### 開発用
- `npm run dev` - Turbopackを使用した開発サーバーの起動（高速リフレッシュ対応、http://localhost:3000）
- `npm run build` - 本番用アプリケーションのビルド
- `npm run start` - 本番サーバーの起動
- `npm run lint` - ESLintを実行してコード品質をチェック
- `npm run generate:api` - APIクライアントと型の生成
- `npm run generate:api:watch` - APIクライアントの自動生成（監視モード）

## アーキテクチャ概要

Next.js 15.3のApp Routerアーキテクチャを使用して構築された日本の家計簿管理アプリケーション（家計簿アプリ）です。

### 技術スタック
- **Next.js 15.3** App RouteとTurbopack対応
- **React 19** TypeScript 5対応
- **Redux Toolkit** 状態管理
- **Tailwind CSS v4** スタイリング
- **React Query (TanStack Query)** APIクライアント
- **MSW (Mock Service Worker)** APIモック
- **Orval** コード生成
- **ESLint** コード品質管理

### プロジェクト構成
- `/app` - Next.js App Routerのページとレイアウト
  - `layout.tsx` - Redux Provider、Navigation、日本語ロケールを含むルートレイアウト
  - `page.tsx` - 月収入/支出/残高を表示するダッシュボードページ
- `/components` - タイプ別に整理されたReactコンポーネント
  - `/common` - 共有コンポーネント（Navigation）
  - `/features` - 機能固有のコンポーネント
- `/src` - アプリケーションのコアロジック
  - `/api/generated` - Orvalで生成されたAPI関連コード
  - `/api/mutator` - カスタムfetchインスタンス
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

### 主要なアーキテクチャ決定

1. **App Routerパターン**: Next.js 15のApp Routerをファイルベースルーティングに使用。現在はルートページのみ実装済み。

2. **状態管理**: Redux Toolkitを基本的なstore構造で設定。クライアントサイドProviderコンポーネントを使用してルートレイアウトレベルでstoreをラップ。

3. **スタイリング**: Tailwind CSS v4とカスタムGeistフォント（SansとMono）をルートレイアウトで設定。

4. **日本語ローカライゼーション**: HTML要素に`lang="ja"`を設定して完全に日本語にローカライズ。

5. **クライアントコンポーネント**: クライアントサイド機能が必要なコンポーネント（Redux Provider）に'use client'ディレクティブを使用。

### 現在の実装状況

基本的なインフラストラクチャとAPI統合機能が整備済み：
- ダッシュボードUIスケルトンが存在
- ナビゲーション構造定義済み（ホーム、取引入力、履歴、設定）
- Redux storeが設定済みだが最小限の状態
- **OrvalとMSWによるAPI統合が実装済み**
- **OpenAPI仕様書からのTypeScript型自動生成**
- **開発用モックAPIレスポンス利用可能**

### API統合（新規）

#### Orval設定
- 場所: `orval.config.ts`
- OpenAPI仕様書からTypeScript型とReact Queryフックを生成
- ソース: `../household-budget-api/specs/expense-api.yaml`
- 出力先: `/src/api/generated/`

#### MSW (Mock Service Worker)
- 開発環境でAPIリクエストを自動的にインターセプト
- モックハンドラー: `/src/mocks/handlers.ts`
- 自動生成されたモック: `/src/api/generated/*/**.msw.ts`
- Service Worker: `/public/mockServiceWorker.js`

#### React Query統合
- `/src/providers/query-provider.tsx`でプロバイダー設定
- 全APIエンドポイント用の自動生成フック
- JWT認証対応のカスタムfetchインスタンス

### ナビゲーションルート（予定）
- `/` - ダッシュボード（実装済み）
- `/transactions/new` - 新規取引追加（未実装）
- `/history` - 取引履歴（未実装）
- `/settings` - アプリ設定（未実装）


## ログ管理

- 実装完了後、`/_docs/` に「yyyy-mm-dd_機能名.md」で実装ログを残してください
  - pushのタイミングでログを作成する
  - yyyy-mm-ddについては今日の日付をコマンドnowで取得する
  - 実装の背景・設計意図・実装内容・副作用・関連ファイルを簡潔に書く
    - 実装内容については省略せずに各手順を網羅して書く
- 起動時にも`/_docs/` 配下を読んでおくこと
- **注意**: `/_docs/` 配下のファイルはローカル管理用のため、コミット・プッシュしないこと（.gitignoreで除外済み）
  
