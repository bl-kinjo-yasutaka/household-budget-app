import type { Meta, StoryObj } from '@storybook/react';
import { CategoryColorBadge } from './CategoryColorBadge';
import { CategoryType } from '@/src/api/generated/model';

const meta: Meta<typeof CategoryColorBadge> = {
  title: 'UI/CategoryColorBadge',
  component: CategoryColorBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleIncomeCategory = {
  id: 1,
  name: '給与',
  type: CategoryType.income,
  colorHex: '#059669',
  userId: 1,
  createdAt: '2024-01-01',
};

const sampleExpenseCategory = {
  id: 2,
  name: '食費',
  type: CategoryType.expense,
  colorHex: '#dc2626',
  userId: 1,
  createdAt: '2024-01-01',
};

export const IncomeCategory: Story = {
  args: {
    category: sampleIncomeCategory,
    size: 'md',
  },
};

export const ExpenseCategory: Story = {
  args: {
    category: sampleExpenseCategory,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    category: sampleIncomeCategory,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    category: sampleExpenseCategory,
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <CategoryColorBadge category={sampleIncomeCategory} size="sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium</h3>
        <CategoryColorBadge category={sampleIncomeCategory} size="md" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <CategoryColorBadge category={sampleIncomeCategory} size="lg" />
      </div>
    </div>
  ),
};

export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-2">
      <CategoryColorBadge
        category={{ ...sampleIncomeCategory, colorHex: '#059669', name: '給与' }}
      />
      <CategoryColorBadge
        category={{ ...sampleExpenseCategory, colorHex: '#dc2626', name: '食費' }}
      />
      <CategoryColorBadge
        category={{ ...sampleExpenseCategory, colorHex: '#7c3aed', name: '交通費' }}
      />
      <CategoryColorBadge
        category={{ ...sampleExpenseCategory, colorHex: '#ea580c', name: '娯楽' }}
      />
      <CategoryColorBadge
        category={{ ...sampleIncomeCategory, colorHex: '#10b981', name: '副業' }}
      />
    </div>
  ),
};
