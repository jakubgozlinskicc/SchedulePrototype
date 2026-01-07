import { useState } from "react";

const MIN_ITEMS_PER_PAGE = 1;
const MAX_ITEMS_PER_PAGE = 100;

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
}: UsePaginationOptions) {
  const safeItemsPerPage = Math.min(
    Math.max(MIN_ITEMS_PER_PAGE, itemsPerPage),
    MAX_ITEMS_PER_PAGE
  );

  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * safeItemsPerPage;
  const endIndex = startIndex + safeItemsPerPage;

  return {
    currentPage,
    totalPages,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    startIndex,
    endIndex,
    onPageChange: (page: number) => setRequestedPage(page),
    onNext: () => setRequestedPage((p) => p + 1),
    onPrevious: () => setRequestedPage((p) => p - 1),
    goToFirstPage: () => setRequestedPage(1),
    goToLastPage: () => setRequestedPage(totalPages),
    reset: () => setRequestedPage(1),
  };
}
