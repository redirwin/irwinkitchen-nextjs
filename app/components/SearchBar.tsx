import { Input } from "@/app/components/ui/input"

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="w-1/3">
      <Input 
        type="search" 
        placeholder="Search recipes..." 
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
}
