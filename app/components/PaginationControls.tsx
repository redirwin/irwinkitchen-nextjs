import { Button } from "@/app/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalButtons = 7; // Total number of buttons to show (including ellipsis)

    if (totalPages <= totalButtons) {
      // If total pages are less than or equal to total buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add first page
      pageNumbers.push(1);

      if (currentPage <= 3) {
        // If current page is near the start
        for (let i = 2; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
      } else if (currentPage >= totalPages - 2) {
        // If current page is near the end
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Current page is in the middle
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
      }

      // Always add last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) {
      onPageChange(1); // Go to first page if we're on the last page
    } else {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage === 1 ? totalPages : currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="hidden sm:flex items-center space-x-2">
        {getPageNumbers().map((pageNumber, index) => (
          pageNumber === 'ellipsis' ? (
            <Button key={`ellipsis-${index}`} variant="outline" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNumber as number)}
            >
              {pageNumber}
            </Button>
          )
        ))}
      </div>
      <div className="sm:hidden">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
