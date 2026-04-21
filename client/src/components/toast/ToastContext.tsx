import { createContext, useReducer, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string };

interface ToastContextValue {
  toasts: Toast[];
  dispatch: React.Dispatch<ToastAction>;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

function reducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, { ...action.payload, id: crypto.randomUUID() }].slice(-5);
    case 'REMOVE_TOAST':
      return state.filter((t) => t.id !== action.payload);
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  return <ToastContext.Provider value={{ toasts, dispatch }}>{children}</ToastContext.Provider>;
}
