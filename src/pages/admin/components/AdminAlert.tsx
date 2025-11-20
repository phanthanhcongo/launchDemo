import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export interface AdminAlertProps {
  message: string | null;
  type?: 'error' | 'success';
  onClose?: () => void;
}

export function AdminAlert({ message, type = 'error', onClose }: AdminAlertProps) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, type === 'error' ? 15000 : 5000);
      return () => clearTimeout(timer);
    }
  }, [message, type, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div
      className={cn(
        'mb-6 p-4 rounded-lg relative',
        type === 'error'
          ? 'bg-red-50 border border-red-200 text-red-800'
          : 'bg-green-50 border border-green-200 text-green-800'
      )}
    >
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div>{message}</div>
    </div>
  );
}

