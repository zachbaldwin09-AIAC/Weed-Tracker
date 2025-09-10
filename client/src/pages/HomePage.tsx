import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { StrainSearch } from "@/components/StrainSearch";
import { StrainCard } from "@/components/StrainCard";
import { AddStrainModal } from "@/components/AddStrainModal";
import type { Strain } from "@shared/schema";



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ type?: string; saved?: boolean }>({});
  
  // Fetch strains from API
  const { data: strains = [], isLoading, error } = useQuery<Strain[]>({
    queryKey: ['/api/strains'],
  });

  const filteredStrains = useMemo(() => {
    return strains.filter(strain => {
      // Search filter
      if (searchQuery && !strain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter  
      if (filters.type && strain.type !== filters.type) {
        return false;
      }

      // Saved filter - TODO: Implement user experiences
      if (filters.saved) {
        return false; // For now, no saved strains
      }

      return true;
    });
  }, [strains, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Search query changed: ${query}`);
  };

  const handleFilterChange = (newFilters: { type?: string; saved?: boolean }) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleStrainAdded = () => {
    console.log('Strain added successfully');
    // No need to manually update state - React Query will refetch
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-page-title">
              Discover Strains
            </h2>
            <p className="text-muted-foreground" data-testid="text-page-description">
              Track your cannabis experiences and build your personal strain library
            </p>
          </div>

          <StrainSearch 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-loading">
                  Loading strains...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg" data-testid="text-error">
                  Error loading strains
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Please try again later
                </p>
              </div>
            ) : filteredStrains.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {filteredStrains.length} strain{filteredStrains.length !== 1 ? 's' : ''} found
                </p>
                {filteredStrains.map(strain => (
                  <StrainCard
                    key={strain.id}
                    strain={{
                      id: strain.id,
                      name: strain.name,
                      type: strain.type as 'Indica' | 'Sativa' | 'Hybrid',
                      thcContent: strain.thcContent || 0,
                      description: strain.description || undefined,
                    }}
                    userExperience={undefined} // TODO: Implement user experiences
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="text-no-results">
                  No strains found
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <AddStrainModal onStrainAdded={handleStrainAdded} />
    </div>
  );
}