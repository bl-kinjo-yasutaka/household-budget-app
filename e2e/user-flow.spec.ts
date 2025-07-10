import { test, expect } from '@playwright/test';

test.describe('User Flow: Signup → Login → Add Transaction → Dashboard', () => {
  test('complete user flow from signup to dashboard', async ({ page }) => {
    // テスト用のユーザーデータ
    const testUser = {
      name: 'テスト太郎',
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
    };

    // Step 1: Signup
    await test.step('signup new user', async () => {
      await page.goto('/signup');

      // ページロード確認
      await expect(page.getByText('アカウント作成').first()).toBeVisible();

      // フォーム入力
      await page.fill('input#name', testUser.name);
      await page.fill('input#email', testUser.email);
      await page.fill('input#password', testUser.password);
      await page.fill('input#confirmPassword', testUser.password);

      // サインアップ実行
      await page.click('button[type="submit"]');

      // ダッシュボードにリダイレクトされることを確認
      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toContainText('ダッシュボード');
    });

    // Step 2: Add Transaction
    await test.step('add new transaction', async () => {
      // 取引作成ページに移動
      await page.goto('/transactions/new');

      // ページロード確認
      await expect(page.locator('h1')).toContainText('収支入力');

      // 取引タイプ選択（支出）
      await page.click('[data-testid="expense-tab"]');

      // 取引情報入力(日付は今日の日付)
      await page.fill('input#amount', '1500');
      await page.fill('input#memo', 'テスト用支出');

      // カテゴリ選択（最初のオプションを選択）
      await page.click('[data-testid="category-select"]');
      await page.click('[data-testid="category-option"]:first-child');

      // 取引作成実行
      await page.click('button[type="submit"]');

      // 確認ダイアログが表示されることを確認し、確認ボタンをクリック
      await expect(page.getByText('この支出取引を作成してもよろしいですか？')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      // 取引一覧ページにリダイレクトされることを確認
      await expect(page).toHaveURL('/transactions');

      // ページが正しく読み込まれたことを確認
      await expect(page.locator('h1')).toContainText('取引履歴');

      // MSWのステートレス性により、作成したデータの確認はスキップ
      // 代わりにページ遷移とUIの基本的な表示を確認
      await expect(page.locator('[data-testid="transaction-row"]').first()).toBeVisible();
    });

    // Step 3: Dashboard Basic Display Check
    await test.step('verify dashboard basic display', async () => {
      // ダッシュボードに移動
      await page.goto('/');

      // ダッシュボードのロード確認
      await expect(page.locator('h1')).toContainText('ダッシュボード');

      // 基本的なUIコンポーネントの表示確認
      const expenseCard = page.locator('[data-testid="expense-card"]');
      await expect(expenseCard).toBeVisible();

      const balanceCard = page.locator('[data-testid="balance-card"]');
      await expect(balanceCard).toBeVisible();

      // 最新取引リストの表示確認（MSWの初期データが表示される）
      const recentTransactions = page.locator('[data-testid="recent-transactions"]');
      await expect(recentTransactions).toBeVisible();
    });
  });

  test('login existing user', async ({ page }) => {
    // 既存のテストユーザーでログイン
    const existingUser = {
      email: 'demo@example.com',
      password: 'password123',
    };

    await test.step('login with existing credentials', async () => {
      await page.goto('/login');

      // ページロード確認
      await expect(page.getByText('ログイン').first()).toBeVisible();

      // フォーム入力
      await page.fill('input#email', existingUser.email);
      await page.fill('input#password', existingUser.password);

      // ログイン実行
      await page.click('button[type="submit"]');

      // ダッシュボードにリダイレクトされることを確認
      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toContainText('ダッシュボード');
    });
  });

  test('validation errors on forms', async ({ page }) => {
    await test.step('signup form validation', async () => {
      await page.goto('/signup');

      // 空のフォーム送信
      await page.click('button[type="submit"]');

      // バリデーションエラーの確認
      await expect(page.getByText('名前を入力してください')).toBeVisible();
      await expect(page.getByText('有効なメールアドレスを入力してください')).toBeVisible();
      await expect(page.getByText('パスワードは8文字以上で入力してください')).toBeVisible();
    });

    await test.step('login form validation', async () => {
      await page.goto('/login');

      // 空のフォーム送信
      await page.click('button[type="submit"]');

      // バリデーションエラーの確認
      await expect(page.getByText('有効なメールアドレスを入力してください')).toBeVisible();
      await expect(page.getByText('パスワードは8文字以上で入力してください')).toBeVisible();
    });

    await test.step('transaction form validation', async () => {
      // まずログインする
      await page.goto('/login');
      await page.fill('input#email', 'demo@example.com');
      await page.fill('input#password', 'password123');
      await page.click('button[type="submit"]');

      // ダッシュボードへのリダイレクトを待つ
      await expect(page).toHaveURL('/');

      // 取引作成ページに移動
      await page.goto('/transactions/new');

      // ページが完全に読み込まれるのを待つ
      await expect(page.locator('h1')).toContainText('収支入力');

      // 支出タブが表示されているか確認
      await expect(page.locator('[data-testid="expense-tab"]')).toBeVisible();

      // フォーム送信を試みる（フォーカス/ブラー操作は不要）
      await page.click('button[type="submit"]');

      // バリデーションエラーの確認
      await expect(page.getByText('金額を入力してください')).toBeVisible();
    });
  });

  test('navigation and routing', async ({ page }, testInfo) => {
    // まずログインする
    await page.goto('/login');
    await page.fill('input#email', 'demo@example.com');
    await page.fill('input#password', 'password123');
    await page.click('button[type="submit"]');

    await test.step('navigate between pages', async () => {
      // モバイルデバイスの場合はハンバーガーメニューを開く
      const isMobile = testInfo.project.name.includes('Mobile');

      if (isMobile) {
        // ハンバーガーメニューボタンをクリック
        await page.getByRole('button', { name: 'メニューを開く' }).click();

        // Sheetコンテナが表示されるのを待つ
        const mobileNav = page.locator('[role="dialog"]');
        await mobileNav.waitFor({ state: 'visible' });

        // モバイルメニュー内のナビゲーション要素をクリック
        await mobileNav.locator('[data-testid="nav-transactions"]').click();
      } else {
        // デスクトップの場合は直接クリック
        await page.click('[data-testid="nav-transactions"]');
      }
      await expect(page).toHaveURL('/transactions');
      await expect(page.locator('h1')).toContainText('取引履歴');

      if (isMobile) {
        await page.getByRole('button', { name: 'メニューを開く' }).click();
        const mobileNav = page.locator('[role="dialog"]');
        await mobileNav.waitFor({ state: 'visible' });
        await mobileNav.locator('[data-testid="nav-categories"]').click();
      } else {
        await page.click('[data-testid="nav-categories"]');
      }
      await expect(page).toHaveURL('/categories');
      await expect(page.locator('h1')).toContainText('カテゴリ管理');

      if (isMobile) {
        await page.getByRole('button', { name: 'メニューを開く' }).click();
        const mobileNav = page.locator('[role="dialog"]');
        await mobileNav.waitFor({ state: 'visible' });
        await mobileNav.locator('[data-testid="nav-settings"]').click();
      } else {
        await page.click('[data-testid="nav-settings"]');
      }
      await expect(page).toHaveURL('/settings');
      await expect(page.locator('h1')).toContainText('設定');

      if (isMobile) {
        await page.getByRole('button', { name: 'メニューを開く' }).click();
        const mobileNav = page.locator('[role="dialog"]');
        await mobileNav.waitFor({ state: 'visible' });
        await mobileNav.locator('[data-testid="nav-dashboard"]').click();
      } else {
        await page.click('[data-testid="nav-dashboard"]');
      }
      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toContainText('ダッシュボード');
    });
  });
});
