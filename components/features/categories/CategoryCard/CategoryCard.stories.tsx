import type { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './CategoryCard';
import { CategoryType } from '@/src/api/generated/model';

// Storybookで使用するモックデータ
const mockCategories = {
  income: {
    id: 1,
    name: '給与',
    type: CategoryType.income,
    colorHex: '#059669',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  expense: {
    id: 2,
    name: '食費',
    type: CategoryType.expense,
    colorHex: '#dc2626',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  housing: {
    id: 3,
    name: '住居費',
    type: CategoryType.expense,
    colorHex: '#7c3aed',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  transportation: {
    id: 4,
    name: '交通費',
    type: CategoryType.expense,
    colorHex: '#ea580c',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  entertainment: {
    id: 5,
    name: '娯楽',
    type: CategoryType.expense,
    colorHex: '#0ea5e9',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  freelance: {
    id: 6,
    name: '副業収入',
    type: CategoryType.income,
    colorHex: '#10b981',
    userId: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
};

const meta: Meta<typeof CategoryCard> = {
  title: 'Features/Categories/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
    isDeleting: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const IncomeCategory: Story = {
  args: {
    category: mockCategories.income,
    onEdit: () => console.log('Edit income category'),
    onDelete: () => console.log('Delete income category'),
    isDeleting: false,
  },
};

export const ExpenseCategory: Story = {
  args: {
    category: mockCategories.expense,
    onEdit: () => console.log('Edit expense category'),
    onDelete: () => console.log('Delete expense category'),
    isDeleting: false,
  },
};

export const HousingCategory: Story = {
  args: {
    category: mockCategories.housing,
    onEdit: () => console.log('Edit housing category'),
    onDelete: () => console.log('Delete housing category'),
    isDeleting: false,
  },
};

export const TransportationCategory: Story = {
  args: {
    category: mockCategories.transportation,
    onEdit: () => console.log('Edit transportation category'),
    onDelete: () => console.log('Delete transportation category'),
    isDeleting: false,
  },
};

export const EntertainmentCategory: Story = {
  args: {
    category: mockCategories.entertainment,
    onEdit: () => console.log('Edit entertainment category'),
    onDelete: () => console.log('Delete entertainment category'),
    isDeleting: false,
  },
};

export const FreelanceIncomeCategory: Story = {
  args: {
    category: mockCategories.freelance,
    onEdit: () => console.log('Edit freelance category'),
    onDelete: () => console.log('Delete freelance category'),
    isDeleting: false,
  },
};

export const DeletingState: Story = {
  args: {
    category: mockCategories.expense,
    onEdit: () => console.log('Edit expense category'),
    onDelete: () => console.log('Delete expense category'),
    isDeleting: true,
  },
};

export const CategoryGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Object.values(mockCategories).map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={() => console.log(`Edit ${category.name}`)}
          onDelete={() => console.log(`Delete ${category.name}`)}
          isDeleting={false}
        />
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
