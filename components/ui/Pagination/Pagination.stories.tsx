import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import type { ComponentProps } from 'react';

// 基本的なpropsを定義し、型を事前検証
const baseArgs = {
  currentPage: 1,
  totalPages: 10,
  totalItems: 100,
  itemsPerPage: 10,
  onPageChange: (page: number) => console.log('Page changed to:', page),
} satisfies ComponentProps<typeof Pagination>;

// 型キャスト用の型エイリアス
type PaginationProps = ComponentProps<typeof Pagination>;

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: '現在のページ番号',
    },
    totalPages: {
      control: 'number',
      description: '総ページ数',
    },
    totalItems: {
      control: 'number',
      description: 'アイテムの総数',
    },
    itemsPerPage: {
      control: 'number',
      description: '1ページあたりのアイテム数',
    },
    showItemsRange: {
      control: 'boolean',
      description: 'アイテム範囲の表示/非表示',
    },
    size: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
      description: 'コンポーネントのサイズ',
    },
    variant: {
      control: 'select',
      options: ['bordered', 'plain', 'card'],
      description: '視覚的なスタイルバリアント',
    },
    density: {
      control: 'select',
      options: ['full', 'nav-only', 'minimal'],
      description: '表示内容の密度',
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: baseArgs,
};

export const MiddlePage: Story = {
  args: {
    ...baseArgs,
    currentPage: 5,
  },
};

export const LastPage: Story = {
  args: {
    ...baseArgs,
    currentPage: 10,
  },
};

export const CompactSize: Story = {
  args: {
    ...baseArgs,
    currentPage: 3,
    totalPages: 8,
    totalItems: 80,
    size: 'compact',
  },
};

export const MinimalSize: Story = {
  args: {
    ...baseArgs,
    currentPage: 2,
    totalPages: 5,
    totalItems: 50,
    size: 'minimal',
  },
};

export const CardVariant: Story = {
  args: {
    ...baseArgs,
    currentPage: 2,
    totalPages: 5,
    totalItems: 50,
    variant: 'card',
  },
};

export const PlainVariant: Story = {
  args: {
    ...baseArgs,
    currentPage: 3,
    totalPages: 7,
    totalItems: 70,
    variant: 'plain',
  },
};

export const NavOnlyDensity: Story = {
  args: {
    ...baseArgs,
    currentPage: 4,
    totalPages: 20,
    totalItems: 200,
    density: 'nav-only',
  },
};

export const MinimalDensity: Story = {
  args: {
    ...baseArgs,
    totalPages: 5,
    totalItems: 50,
    density: 'minimal',
  },
};

export const WithoutItemsRange: Story = {
  args: {
    ...baseArgs,
    currentPage: 3,
    showItemsRange: false,
  },
};

export const Disabled: Story = {
  args: {
    ...baseArgs,
    disabled: true,
  },
};

export const SinglePage: Story = {
  args: {
    ...baseArgs,
    totalPages: 1,
    totalItems: 5,
  },
};

// レスポンシブ表示を確認するためのストーリー
export const ResponsiveDemo: Story = {
  args: {
    ...baseArgs,
    currentPage: 5,
  },
  render: (args) => {
    const props = args as PaginationProps;
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Full Density (デフォルト)</h3>
          <Pagination {...props} density="full" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Nav Only Density</h3>
          <Pagination {...props} density="nav-only" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Minimal Density</h3>
          <Pagination {...props} density="minimal" />
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          ※ ブラウザ幅を変更してレスポンシブ動作を確認してください
        </div>
      </div>
    );
  },
};

// 全バリエーションを表示
export const AllVariants: Story = {
  render: () => {
    const sampleArgs: PaginationProps = { ...baseArgs, currentPage: 3, onPageChange: () => {} };

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Size Variants</h3>
          <div className="space-y-4">
            <Pagination {...sampleArgs} size="default" />
            <Pagination {...sampleArgs} size="compact" />
            <Pagination {...sampleArgs} size="minimal" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Style Variants</h3>
          <div className="space-y-4">
            <Pagination {...sampleArgs} variant="bordered" />
            <Pagination {...sampleArgs} variant="plain" />
            <Pagination {...sampleArgs} variant="card" />
          </div>
        </div>
      </div>
    );
  },
};
