"use client";

import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
            {page}
          </span>
        ),
      )}

      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
      >
        ›
      </button>
    </div>
  );
}
