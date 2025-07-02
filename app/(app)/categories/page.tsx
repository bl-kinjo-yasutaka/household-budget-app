'use client';

import { useState } from 'react';
import { CategoryList } from '@/components/features/categories/category-list';
import { CategoryFormModal } from '@/components/features/categories/category-form-modal';
import type { Category } from '@/src/api/generated/model';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </div>
  );
}
