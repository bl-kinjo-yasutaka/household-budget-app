import type { Meta, StoryObj } from '@storybook/react';
import { LoadingIndicator } from './LoadingIndicator';

const meta: Meta<typeof LoadingIndicator> = {
  title: 'UI/LoadingIndicator',
  component: LoadingIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'chart', 'form-skeleton', 'stats-skeleton', 'list-skeleton'],
    },
    count: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: {
    variant: 'spinner',
  },
};

export const Chart: Story = {
  args: {
    variant: 'chart',
  },
};

export const FormSkeleton: Story = {
  args: {
    variant: 'form-skeleton',
    count: 3,
  },
};

export const StatsSkeleton: Story = {
  args: {
    variant: 'stats-skeleton',
    count: 3,
  },
};

export const ListSkeleton: Story = {
  args: {
    variant: 'list-skeleton',
    count: 5,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Spinner</h3>
        <LoadingIndicator variant="spinner" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Chart</h3>
        <LoadingIndicator variant="chart" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Form Skeleton</h3>
        <LoadingIndicator variant="form-skeleton" count={3} />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">List Skeleton</h3>
        <LoadingIndicator variant="list-skeleton" count={3} />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Stats Skeleton</h3>
        <LoadingIndicator variant="stats-skeleton" count={3} />
      </div>
    </div>
  ),
};
