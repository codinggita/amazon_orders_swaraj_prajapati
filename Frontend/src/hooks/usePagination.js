import { useState } from 'react';

export default function usePagination(initialPage = 1, initialLimit = 10, initialTotal = 0) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(initialTotal);

  const totalPages = Math.ceil(total / limit) || 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const nextPage = () => {
    if (hasNext) setPage(p => p + 1);
  };

  const prevPage = () => {
    if (hasPrev) setPage(p => p - 1);
  };

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    hasNext,
    hasPrev,
    nextPage,
    prevPage
  };
}
