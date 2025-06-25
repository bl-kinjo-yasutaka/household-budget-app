# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) に指針を提供します。

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
- **React Hook Form + Zod** フォームバリデーション
- **js-cookie** Cookie管理
- **ESLint** コード品質管理
- **Prettier** コードフォーマッター
- **Husky + lint-staged** Git Hooks管理

### プロジェクト構成

- `/app` - Next.js App Routerのページとレイアウト
  - `/(auth)` - 認証ページグループ（未認証ユーザー用）
    - `/login/page.tsx` - ログインページ
    - `/signup/page.tsx` - サインアップページ
    - `layout.tsx` - 認証レイアウト（自動リダイレクト機能付き）
  - `/(app)` - 認証済みページグループ
    - `page.tsx` - 月収入/支出/残高を表示するダッシュボードページ
    - `layout.tsx` - アプリレイアウト（Navigation付き、ルートガード機能）
  - `layout.tsx` - ルートレイアウト（全Provider設定）
  - `not-found.tsx` - 404エラーページ
- `/components` - タイプ別に整理されたReactコンポーネント
  - `/common` - 共有コンポーネント（Navigation）
  - `/features` - 機能固有のコンポーネント
- `/src` - アプリケーションのコアロジック
  - `/api/generated` - Orvalで生成されたAPI関連コード
  - `/api/mutator` - カスタムfetchインスタンス（Cookie認証対応）
  - `/contexts` - React Contexts
    - `auth-context.tsx` - 認証状態管理
  - `/lib` - ライブラリユーティリティ
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

### 主要なアーキテクチャ決定

1. **App Routerパターン**: Next.js 15のApp Routerをファイルベースルーティングに使用。Route Groupsで認証済み/未認証ページを分離。

2. **状態管理**: Redux Toolkitを基本的なstore構造で設定。認証状態はReact Context（AuthContext）で管理。

3. **スタイリング**: Tailwind CSS v4とカスタムGeistフォント（SansとMono）をルートレイアウトで設定。

4. **日本語ローカライゼーション**: HTML要素に`lang="ja"`を設定して完全に日本語にローカライズ。

5. **認証方式**: JWT（Cookie-based、有効期限30分）。ルートガードによる自動リダイレクト実装。

6. **フォームバリデーション**: React Hook Form + Zodによるタイプセーフなバリデーション。

### 現在の実装状況

基本的なインフラストラクチャとAPI統合機能が整備済み：

- **認証システム完全実装済み**（JWT Cookie認証、Redux統合、最適化されたAPIコール）
- **ユーザー状態管理**（Redux + React Query統合、セキュアなCookie管理）
- ダッシュボードUIスケルトンが存在
- ナビゲーション構造定義済み（ホーム、取引入力、履歴、設定）
- **Redux storeが本格稼働**（ユーザー状態、アプリ状態管理）
- **OrvalとMSWによるAPI統合が実装済み**
- **OpenAPI仕様書からのTypeScript型自動生成**
- **開発用モックAPIレスポンス利用可能**
- **フォームバリデーション（React Hook Form + Zod）実装済み**

### API統合（新規）

#### Orval設定

- 場所: `orval.config.ts`
- OpenAPI仕様書からTypeScript型とReact Queryフックを生成
- ソース: `../household-budget-api/specs/expense-api.yaml` (v0.1.1)
- 出力先: `/src/api/generated/`

#### MSW (Mock Service Worker)

- 開発環境でAPIリクエストを自動的にインターセプト
- モックハンドラー: `/src/mocks/handlers.ts`
- 自動生成されたモック: `/src/api/generated/*/**.msw.ts`
- Service Worker: `/public/mockServiceWorker.js`

#### React Query統合

- `/src/providers/query-provider.tsx`でプロバイダー設定
- 全APIエンドポイント用の自動生成フック
- JWT認証対応のカスタムfetchインスタンス（Cookieから自動取得）

### 認証・ユーザー管理アーキテクチャ

#### JWT Cookie認証

- **トークン管理**: JWTトークンのみCookieに保存（30分有効期限）
- **セキュリティ設定**: `secure`, `sameSite: strict`, `path: /`
- **ユーザー情報**: DBから取得してReduxで管理（Cookieには保存しない）

#### APIコールタイミング最適化

1. **初回ロード時**: トークン存在時のみ `/user/me` でユーザー情報取得
2. **ログイン時**: APIレスポンスから直接Redux設定（追加API不要）
3. **認証エラー**: 401エラー時に自動ログアウト + ログインページリダイレクト
4. **キャッシュ戦略**: React Query（5分stale, 10分gc, ログアウト時クリア）

#### ユーザー状態管理

- **Redux Store**: `userSlice`でユーザー情報の状態管理
- **AuthContext**: 認証フロー制御（ログイン/ログアウト/ルートガード）
- **React Query**: `/user/me` エンドポイントのキャッシュ管理

### ナビゲーションルート

#### 実装済み

- `/login` - ログインページ（フォームバリデーション、自動ログイン）
- `/signup` - サインアップページ（パスワード確認、自動ログイン）
- `/` - ダッシュボード（認証済みユーザーのみ、ルートガード）
- `/404` - カスタム404ページ

#### 未実装

- `/transactions` - 取引一覧
- `/transactions/new` - 新規取引追加
- `/transactions/[id]/edit` - 取引編集
- `/categories` - カテゴリ管理
- `/settings` - ユーザー設定

## ログ管理

### **重要**: ログ作成は必須のタスクです

- **すべての機能実装・修正・設定作業の完了後**、必ず`/_docs/`に実装ログを残すこと
- ユーザーからの指示がなくても**自動的に**ログ作成を実行すること
- ファイル名形式: `yyyy-mm-dd_機能名.md`（日付は`date "+%Y-%m-%d"`コマンドで取得）

### ログ記載内容（必須項目）

1. **実装日**: `date`コマンドで取得した今日の日付
2. **実装の背景**: なぜこの実装が必要だったか
3. **設計意図**: どのような方針・考慮事項で設計したか
4. **実装内容**: 実装した内容を**省略せずに各手順を網羅**して記載
   - 追加・変更したファイルとその詳細
   - 実行したコマンド
   - 遭遇した問題と解決方法
   - 設定内容の具体例
5. **副作用**: 実装による影響・注意点
6. **関連ファイル**: 変更・追加したすべてのファイルのパス

### ログ作成タイミング

- コミット・プッシュ完了後
- ユーザーからの指示完了後
- 作業が一段落した時点

### その他

- 起動時にも`/_docs/`配下を読んでプロジェクト状況を把握すること
- **注意**: `/_docs/`配下のファイルはローカル管理用のため、コミット・プッシュしないこと（.gitignoreで除外済み）
