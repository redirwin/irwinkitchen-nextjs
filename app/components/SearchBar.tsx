import { Input } from "@/app/components/ui/input"

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="w-full sm:w-64 md:w-80">
      <Input 
        type="search" 
        placeholder="Search recipes..." 
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full"
      />
    </div>
  );
}
