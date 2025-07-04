import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './Sonner';
import { Button } from '../Button/Button';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => toast('Event has been created')}>
        Show Toast
      </Button>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => toast.success('Successfully saved!')}>
        Success Toast
      </Button>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => toast.error('Something went wrong!')}>
        Error Toast
      </Button>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => toast.warning('Please check your input')}>
        Warning Toast
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            action: {
              label: 'Undo',
              onClick: () => toast('Undo action triggered'),
            },
          })
        }
      >
        Toast with Action
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
          })
        }
      >
        Toast with Description
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="outline" onClick={() => toast.loading('Loading...')}>
        Loading Toast
      </Button>
    </div>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={() => {
          const promiseFn = () => {
            return new Promise<void>((resolve) => {
              setTimeout(() => resolve(), 2000);
            });
          };

          toast.promise(promiseFn, {
            loading: 'Loading...',
            success: 'Data has been saved',
            error: 'Error occurred',
          });
        }}
      >
        Promise Toast
      </Button>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-x-2 space-y-2 flex flex-wrap">
      <Button variant="outline" onClick={() => toast('Default message')}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success('Success message')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error('Error message')}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Warning message')}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info('Info message')}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.loading('Loading message')}>
        Loading
      </Button>
    </div>
  ),
};
