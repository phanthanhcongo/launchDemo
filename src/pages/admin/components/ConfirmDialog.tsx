import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  position: { top: number; left: number };
}

export function ConfirmDialog({ message, onConfirm, onCancel, position }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    // Use setTimeout to ensure the element is rendered before measuring
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const rect = dialogRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let top = position.top;
        let left = position.left;

        // Adjust if dialog goes off right edge
        if (left + rect.width > windowWidth) {
          left = windowWidth - rect.width - 16;
        }

        // Adjust if dialog goes off bottom edge
        if (top + rect.height > windowHeight) {
          top = position.top - rect.height - 8;
        }

        // Ensure dialog doesn't go off left edge
        if (left < 16) {
          left = 16;
        }

        // Ensure dialog doesn't go off top edge
        if (top < 16) {
          top = 16;
        }

        setAdjustedPosition({ top, left });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start" style={{ pointerEvents: 'none' }}>
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] max-w-[320px]"
        style={{
          position: 'fixed',
          top: `${adjustedPosition.top}px`,
          left: `${adjustedPosition.left}px`,
          pointerEvents: 'auto',
          zIndex: 1000,
        }}
      >
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'border border-gray-300 text-gray-700 bg-white',
              'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300'
            )}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg',
              'bg-red-600 text-white',
              'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
            )}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

