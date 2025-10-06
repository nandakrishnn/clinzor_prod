import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning
    if (currentPage <= halfVisible) {
      endPage = maxVisiblePages;
    }
    
    // Adjust if we're near the end
    if (currentPage > totalPages - halfVisible) {
      startPage = totalPages - maxVisiblePages + 1;
    }

    const pages: (number | string)[] = [];

    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center mt-4 gap-2">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm hover:bg-gray-50 transition-colors"
      >
        Prev
      </button>
      
      {visiblePages.map((page, idx) => (
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-3 py-2 text-gray-500 font-medium text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page as number)}
            className={`px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
              currentPage === page 
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;