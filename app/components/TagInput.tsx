import React, { useState, useEffect } from 'react';
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  allTags: string[];
  maxTags?: number;
}

export function TagInput({ value, onChange, allTags, maxTags = 6 }: TagInputProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setSelectedTags(tags);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    if (updatedTags.length <= maxTags) {
      onChange(updatedTags.join(', '));
    }
  };

  return (
    <div>
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder="Enter tags, separated by commas"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "secondary"}
            className="cursor-pointer transition-colors duration-200"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      {selectedTags.length >= maxTags && (
        <p className="text-sm text-red-500 mt-2">Maximum of {maxTags} tags reached.</p>
      )}
    </div>
  );
}
