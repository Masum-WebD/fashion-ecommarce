import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const getPageNumbers = (current: number, last: number): (number | "ellipsis")[] => {
  if (last <= 1) return [];
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const range = 2;

  if (current > range + 2) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - range);
  const end = Math.min(last - 1, current + range);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < last - range - 1) {
    pages.push("ellipsis");
  }

  pages.push(last);
  return pages;
};

const Pagination = ({ currentPage, lastPage, onPageChange, className }: PaginationProps) => {
  if (lastPage <= 1) return null;

  const pages = getPageNumbers(currentPage, lastPage);

  return (
    <div className={cn("flex items-center justify-center gap-1 md:gap-2", className)}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="inline-flex  h-6 md:h-10  w-6 md:w-10 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} className="rotate-180" />
      </button>

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex  h-6 md:h-10  w-6 md:w-10 items-center justify-center text-[12px] md:text-sm font-medium text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={cn(
              "inline-flex h-6 md:h-10  w-6 md:w-10 items-center justify-center rounded-full text-[10px] md:text-sm font-semibold transition-colors",
              page === currentPage
                ? "bg-primary text-white shadow-md"
                : "border border-border bg-white text-foreground hover:bg-muted"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage >= lastPage}
        className="inline-flex  h-6 md:h-10  w-6 md:w-10 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
