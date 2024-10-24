import { Input } from "@/app/components/ui/input"
import { X } from "lucide-react"

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onClearSearch }: SearchBarProps) {
  return (
    <div className="w-full sm:w-64 md:w-80 relative">
      <Input 
        type="text"
        placeholder="Search recipes..." 
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full pr-8"
      />
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
