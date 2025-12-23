import { useState } from "react";

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
}: UsePaginationOptions) {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex,
    goToPage: (page: number) => setRequestedPage(page),
    goToNextPage: () => setRequestedPage((p) => p + 1),
    goToPreviousPage: () => setRequestedPage((p) => p - 1),
    goToFirstPage: () => setRequestedPage(1),
    goToLastPage: () => setRequestedPage(totalPages),
    reset: () => setRequestedPage(1),
  };
}
