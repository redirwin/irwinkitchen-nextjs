import { Badge } from "@/app/components/ui/badge"
import { X } from "lucide-react"
import { toTitleCase } from "@/app/utils/stringUtils"

interface TagListProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onResetTags: () => void;
}

export function TagList({ allTags, selectedTags, onTagToggle, onResetTags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allTags.map(tag => (
        <Badge 
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "secondary"}
          className="cursor-pointer transition-colors duration-200"
          onClick={() => onTagToggle(tag)}
        >
          {toTitleCase(tag)}
        </Badge>
      ))}
      {(selectedTags.length > 0) && (
        <Badge 
          variant="outline"
          className="cursor-pointer transition-colors duration-200 bg-destructive/10 hover:bg-destructive/20 text-destructive"
          onClick={onResetTags}
        >
          <X className="h-3 w-3 mr-1" />
          Reset All
        </Badge>
      )}
    </div>
  );
}
