import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
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
    <>
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
      </div>
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filtered by: {selectedTags.map(toTitleCase).join(', ')}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetTags}
            className="h-8 px-2 text-xs"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      )}
    </>
  );
}
