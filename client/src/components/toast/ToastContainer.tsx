import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './ToastContext';
import ToastItem from './ToastItem';

export default function ToastContainer() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  const { toasts, dispatch } = ctx;

  function handleRemove(id: string) {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }

  return createPortal(
    <div className="fixed top-[8rem] right-[2rem] z-50 flex flex-col items-end gap-[0.8rem]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>,
    document.body,
  );
}
