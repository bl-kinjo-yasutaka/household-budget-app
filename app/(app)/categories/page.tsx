'use client';

import { useState } from 'react';
import { CategoryList } from '@/components/features/categories';
import {
  CreateCategoryModal,
  EditCategoryModal,
} from '@/components/features/categories/dynamic-modals';
import type { Category } from '@/src/api/generated/model';

export default function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">カテゴリ管理</h1>
          <p className="text-muted-foreground">収支の分類を管理</p>
        </div>
      </div>

      {/* Categories List */}
      <CategoryList onCreateCategory={handleCreateCategory} onEditCategory={handleEditCategory} />

      {/* Create Category Modal */}
      <CreateCategoryModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          category={editingCategory}
        />
      )}
    </div>
  );
}
