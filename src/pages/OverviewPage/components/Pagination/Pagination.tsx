import { Button } from "../../../../components/Button/Button";
import { getPages } from "./getPages";
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
  const pages = getPages(currentPage, totalPages);

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <Button variant="primary" onClick={onPrevious} disabled={!hasPrevious}>
          <i className="fa-solid fa-arrow-left"></i>
        </Button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`}>...</span>
          ) : (
            <Button
              key={page}
              variant="primary"
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
