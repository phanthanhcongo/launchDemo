import { Button } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ pagination, onPageChange }: AdminPaginationProps) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total } = pagination;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex gap-2">
        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'px-3 py-1 border border-gray-300 rounded',
                pageNum === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              )}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

