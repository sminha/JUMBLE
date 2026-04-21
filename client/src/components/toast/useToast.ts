import { useContext } from 'react';
import { ToastContext, type ToastType } from './ToastContext';

const DEFAULT_DURATION = 3000;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast는 반드시 ToastProvider 안에서 사용되어야 합니다.');

  function add(type: ToastType, message: string, duration = DEFAULT_DURATION) {
    ctx?.dispatch({ type: 'ADD_TOAST', payload: { type, message, duration } });
  }

  return {
    toast: {
      success: (message: string, duration?: number) => add('success', message, duration),
      error: (message: string, duration?: number) => add('error', message, duration),
      info: (message: string, duration?: number) => add('info', message, duration),
      warning: (message: string, duration?: number) => add('warning', message, duration),
    },
  };
}
