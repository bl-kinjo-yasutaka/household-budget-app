'use client';

import dynamic from 'next/dynamic';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

// 設定フォームコンポーネントの動的インポート（ローディング状態付き）
const UserSettingsForm = dynamic(
  () => import('./user-settings-form').then((mod) => ({ default: mod.UserSettingsForm })),
  {
    loading: () => <LoadingIndicator variant="form-skeleton" count={3} />,
    ssr: false,
  }
);

const PasswordChangeForm = dynamic(
  () => import('./password-change-form').then((mod) => ({ default: mod.PasswordChangeForm })),
  {
    loading: () => <LoadingIndicator variant="form-skeleton" count={3} />,
    ssr: false,
  }
);

const AccountDeleteForm = dynamic(
  () => import('./account-delete-form').then((mod) => ({ default: mod.AccountDeleteForm })),
  {
    loading: () => <LoadingIndicator variant="form-skeleton" count={3} />,
    ssr: false,
  }
);

export { UserSettingsForm, PasswordChangeForm, AccountDeleteForm };
