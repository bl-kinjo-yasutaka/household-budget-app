'use client';

import { useState } from 'react';

interface ConfirmationConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
}

interface ConfirmationState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'destructive';
  onConfirm: (() => void) | null;
}

export function useConfirmationDialog() {
  const [state, setState] = useState<ConfirmationState>({
    open: false,
    title: '',
    description: '',
    confirmText: 'OK',
    cancelText: 'キャンセル',
    variant: 'default',
    onConfirm: null,
  });

  const showConfirmation = (config: ConfirmationConfig) => {
    setState({
      open: true,
      title: config.title,
      description: config.description,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'キャンセル',
      variant: config.variant || 'default',
      onConfirm: config.onConfirm,
    });
  };

  const hideConfirmation = () => {
    setState((prev) => ({ ...prev, open: false, onConfirm: null }));
  };

  const confirmAction = () => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    // 注意: モーダルは手動で閉じる必要がある
  };

  return {
    state,
    showConfirmation,
    hideConfirmation,
    confirmAction,
  };
}
