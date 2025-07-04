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
      await expect(page.locator('h1')).toContainText('アカウント作成');

      // フォーム入力
      await page.fill('input[name="name"]', testUser.name);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);

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
      await expect(page.locator('h1')).toContainText('取引登録');

      // 取引タイプ選択（支出）
      await page.click('[data-testid="expense-tab"]');

      // 取引情報入力
      await page.fill('input[name="amount"]', '1500');
      await page.fill('input[name="description"]', 'テスト用支出');

      // カテゴリ選択（最初のオプションを選択）
      await page.click('[data-testid="category-select"]');
      await page.click('[data-testid="category-option"]:first-child');

      // 取引作成実行
      await page.click('button[type="submit"]');

      // 作成成功の確認
      await expect(page.locator('[data-testid="toast"]')).toContainText('取引を作成しました');

      // 取引一覧ページにリダイレクト
      await expect(page).toHaveURL('/transactions');

      // 作成した取引が一覧に表示されることを確認
      await expect(page.locator('[data-testid="transaction-row"]')).toContainText('テスト用支出');
      await expect(page.locator('[data-testid="transaction-row"]')).toContainText('¥1,500');
    });

    // Step 3: Dashboard Reflection
    await test.step('verify dashboard reflects new transaction', async () => {
      // ダッシュボードに移動
      await page.goto('/');

      // ダッシュボードのロード確認
      await expect(page.locator('h1')).toContainText('ダッシュボード');

      // 支出カードに新しい取引が反映されていることを確認
      const expenseCard = page.locator('[data-testid="expense-card"]');
      await expect(expenseCard).toContainText('¥1,500');
      await expect(expenseCard).toContainText('1 件の支出');

      // 残高カードも更新されていることを確認
      const balanceCard = page.locator('[data-testid="balance-card"]');
      await expect(balanceCard).toContainText('¥-1,500');
      await expect(balanceCard).toContainText('赤字');

      // 最新取引リストにも表示されていることを確認
      const recentTransactions = page.locator('[data-testid="recent-transactions"]');
      await expect(recentTransactions).toContainText('テスト用支出');
      await expect(recentTransactions).toContainText('¥1,500');
    });
  });

  test('login existing user', async ({ page }) => {
    // 既存のテストユーザーでログイン
    const existingUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    await test.step('login with existing credentials', async () => {
      await page.goto('/login');

      // ページロード確認
      await expect(page.locator('h1')).toContainText('ログイン');

      // フォーム入力
      await page.fill('input[name="email"]', existingUser.email);
      await page.fill('input[name="password"]', existingUser.password);

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
      await expect(page.locator('text=名前は必須です')).toBeVisible();
      await expect(page.locator('text=メールアドレスは必須です')).toBeVisible();
      await expect(page.locator('text=パスワードは必須です')).toBeVisible();
    });

    await test.step('login form validation', async () => {
      await page.goto('/login');

      // 空のフォーム送信
      await page.click('button[type="submit"]');

      // バリデーションエラーの確認
      await expect(page.locator('text=メールアドレスは必須です')).toBeVisible();
      await expect(page.locator('text=パスワードは必須です')).toBeVisible();
    });

    await test.step('transaction form validation', async () => {
      // まずログインする
      await page.goto('/login');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      // 取引作成ページに移動
      await page.goto('/transactions/new');

      // 空のフォーム送信
      await page.click('button[type="submit"]');

      // バリデーションエラーの確認
      await expect(page.locator('text=金額は必須です')).toBeVisible();
      await expect(page.locator('text=カテゴリは必須です')).toBeVisible();
    });
  });

  test('navigation and routing', async ({ page }) => {
    // まずログインする
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await test.step('navigate between pages', async () => {
      // ダッシュボードから取引一覧へ
      await page.click('[data-testid="nav-transactions"]');
      await expect(page).toHaveURL('/transactions');
      await expect(page.locator('h1')).toContainText('取引一覧');

      // 取引一覧からカテゴリ管理へ
      await page.click('[data-testid="nav-categories"]');
      await expect(page).toHaveURL('/categories');
      await expect(page.locator('h1')).toContainText('カテゴリ管理');

      // カテゴリ管理から設定へ
      await page.click('[data-testid="nav-settings"]');
      await expect(page).toHaveURL('/settings');
      await expect(page.locator('h1')).toContainText('設定');

      // 設定からダッシュボードへ
      await page.click('[data-testid="nav-dashboard"]');
      await expect(page).toHaveURL('/');
      await expect(page.locator('h1')).toContainText('ダッシュボード');
    });
  });
});
