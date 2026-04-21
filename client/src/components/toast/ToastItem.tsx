import { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Toast } from './ToastContext';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

type Phase = 'enter' | 'visible' | 'exit';

const PHASE: Record<Phase, string> = {
  enter: 'translate-y-4 opacity-0',
  visible: 'translate-y-0 opacity-100',
  exit: '-translate-y-4 opacity-0',
};

const ICON = {
  success: <CheckCircle size={16} className="shrink-0 text-white" />,
  error: <XCircle size={16} className="shrink-0 text-white" />,
  info: <Info size={16} className="shrink-0 text-white" />,
  warning: <AlertTriangle size={16} className="shrink-0 text-white" />,
};

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startTimer() {
    timerRef.current = setTimeout(() => setPhase('exit'), toast.duration);
  }

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('visible'));
    startTimer();
    return () => {
      cancelAnimationFrame(raf);
      clearTimer();
    };
  }, []);

  function handleTransitionEnd() {
    if (phase === 'exit') onRemove(toast.id);
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={cn(
        'bg-primary-1 flex items-center gap-[0.6rem] rounded-[0.8rem] px-[1.6rem] py-[1.8rem] shadow-lg',
        'font-14-m max-w-[36rem] min-w-[27rem] text-white',
        'transition-all duration-300 ease-out',
        toast.type === 'success' && 'bg-[#00C886]',
        toast.type === 'error' && 'bg-[#FA4358]',
        PHASE[phase],
      )}
    >
      {ICON[toast.type]}
      <span className="flex-1">{toast.message}</span>
    </div>
  );
}
