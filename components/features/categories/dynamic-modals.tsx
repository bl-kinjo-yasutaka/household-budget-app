'use client';

import dynamic from 'next/dynamic';
import type { Category } from '@/src/api/generated/model';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';

// モーダルコンポーネントの動的インポート
// モーダルは条件的に表示されるため、必要な時だけ読み込む
const CreateCategoryModal = dynamic(
  () =>
    import('./forms/create-category-modal').then((mod) => ({ default: mod.CreateCategoryModal })),
  {
    loading: () => <LoadingIndicator variant="spinner" height="h-32" />, // モーダルローディング表示
    ssr: false,
  }
);

const EditCategoryModal = dynamic(
  () => import('./forms/edit-category-modal').then((mod) => ({ default: mod.EditCategoryModal })),
  {
    loading: () => <LoadingIndicator variant="spinner" height="h-32" />, // モーダルローディング表示
    ssr: false,
  }
);

// 型定義をエクスポート用に再定義
interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

// 動的インポートコンポーネントの型付きラッパー
const DynamicCreateCategoryModal: React.FC<CreateCategoryModalProps> = (props) => (
  <CreateCategoryModal {...props} />
);

const DynamicEditCategoryModal: React.FC<EditCategoryModalProps> = (props) => (
  <EditCategoryModal {...props} />
);

export {
  DynamicCreateCategoryModal as CreateCategoryModal,
  DynamicEditCategoryModal as EditCategoryModal,
};
