'use client';

import { useState } from 'react';

interface ConfirmationConfig {
  title: string;
  description: string;
  onConfirm: () => void;
}

interface ConfirmationOptions {
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

type ConfirmationState =
  | { open: false }
  | ({ open: true } & ConfirmationConfig & Required<ConfirmationOptions>);

export function useConfirmationDialog() {
  const [state, setState] = useState<ConfirmationState>({ open: false });

  const showConfirmation = (config: ConfirmationConfig, options?: ConfirmationOptions) => {
    setState({
      open: true,
      ...config,
      confirmText: options?.confirmText ?? 'OK',
      cancelText: options?.cancelText ?? 'キャンセル',
      variant: options?.variant ?? 'default',
    });
  };

  const hideConfirmation = () => {
    setState({ open: false });
  };

  return {
    state,
    showConfirmation,
    hideConfirmation,
  };
}
