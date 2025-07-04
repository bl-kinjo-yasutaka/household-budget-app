import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState, NetworkErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    onRetry: () => alert('Retry clicked'),
  },
};

export const NoRetry: Story = {
  args: {
    title: 'Access Denied',
    message: 'You do not have permission to view this content.',
  },
};

export const CustomVariant: Story = {
  args: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    variant: 'network',
    onRetry: () => alert('Retry clicked'),
  },
};

export const NetworkError: Story = {
  render: () => <NetworkErrorState onRetry={() => alert('Network retry clicked')} />,
};

export const LongDescription: Story = {
  args: {
    title: 'Error Loading Data',
    message:
      'We encountered an issue while trying to load your data. This might be due to a temporary server problem or a network connectivity issue. Please wait a moment and try again.',
    onRetry: () => alert('Retry clicked'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <h3 className="text-sm font-medium mb-4">Generic Error</h3>
        <ErrorState
          title="Something went wrong"
          message="An unexpected error occurred."
          onRetry={() => alert('Generic retry')}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Network Error</h3>
        <NetworkErrorState onRetry={() => alert('Network retry')} />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">No Retry Button</h3>
        <ErrorState title="Access Denied" message="You don't have permission." />
      </div>
    </div>
  ),
};
