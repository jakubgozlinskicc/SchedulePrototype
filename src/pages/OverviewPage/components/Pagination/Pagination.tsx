import { Button } from "../../../../components/Button/Button";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <Button variant="primary" onClick={onPrevious} disabled={!hasPrevious}>
          <i className="fa-solid fa-arrow-left"></i>
        </Button>
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`}>...</span>
          ) : (
            <Button
              key={page}
              variant="secondary"
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button variant="primary" onClick={onNext} disabled={!hasNext}>
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
    </div>
  );
}
