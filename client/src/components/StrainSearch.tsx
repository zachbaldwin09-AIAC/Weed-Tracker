import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StrainSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: { type?: string; saved?: boolean }) => void;
}

export function StrainSearch({ onSearch, onFilterChange }: StrainSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
    console.log(`Searching for: ${value}`);
  };

  const handleTypeFilter = (type: string) => {
    const newType = type === "all" ? "" : type;
    setSelectedType(newType);
    onFilterChange({ type: newType, saved: showSavedOnly });
    console.log(`Filter by type: ${newType || 'all'}`);
  };

  const handleSavedFilter = () => {
    const newSavedFilter = !showSavedOnly;
    setShowSavedOnly(newSavedFilter);
    onFilterChange({ type: selectedType, saved: newSavedFilter });
    console.log(`Show saved only: ${newSavedFilter}`);
  };

  const clearFilters = () => {
    setSelectedType("");
    setShowSavedOnly(false);
    setSearchQuery("");
    onSearch("");
    onFilterChange({});
    console.log('Cleared all filters');
  };

  const hasActiveFilters = selectedType || showSavedOnly || searchQuery;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search strains..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-strain-search"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent" : ""}
          data-testid="button-filter-toggle"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="p-3 bg-card border rounded-lg space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Strain Type
            </label>
            <Select value={selectedType || "all"} onValueChange={handleTypeFilter}>
              <SelectTrigger data-testid="select-strain-type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Indica">Indica</SelectItem>
                <SelectItem value="Sativa">Sativa</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-card-foreground">
              Saved strains only
            </label>
            <Button
              variant={showSavedOnly ? "default" : "outline"}
              size="sm"
              onClick={handleSavedFilter}
              data-testid="button-saved-filter"
            >
              {showSavedOnly ? "On" : "Off"}
            </Button>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" data-testid="badge-search-filter">
              Search: {searchQuery}
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary" data-testid="badge-type-filter">
              Type: {selectedType}
            </Badge>
          )}
          {showSavedOnly && (
            <Badge variant="secondary" data-testid="badge-saved-filter">
              Saved only
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2"
            data-testid="button-clear-filters"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}