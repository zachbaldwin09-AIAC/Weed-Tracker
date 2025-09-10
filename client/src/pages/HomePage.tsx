import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { StrainSearch } from "@/components/StrainSearch";
import { StrainCard } from "@/components/StrainCard";
import { AddStrainModal } from "@/components/AddStrainModal";
import type { Strain, UserStrainExperience } from "@shared/schema";



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ type?: string; saved?: boolean }>({});
  
  // TODO: Get current user ID - for now using a mock user ID
  const currentUserId = "user-1";
  
  // Fetch strains from API
  const { data: strains = [], isLoading, error } = useQuery<Strain[]>({
    queryKey: ['/api/strains'],
  });
  
  // Fetch user experiences for this user
  const { data: userExperiences = [] } = useQuery<UserStrainExperience[]>({
    queryKey: ['/api/user-strain-experiences', currentUserId],
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

      // Saved filter - check if user has saved this strain
      if (filters.saved) {
        const userExperience = userExperiences.find(exp => exp.strainId === strain.id);
        if (!userExperience || !userExperience.saved) {
          return false;
        }
      }

      return true;
    });
  }, [strains, searchQuery, filters, userExperiences]);

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
                {filteredStrains.map(strain => {
                  const userExperience = userExperiences.find(exp => exp.strainId === strain.id);
                  return (
                    <StrainCard
                      key={strain.id}
                      strain={{
                        id: strain.id,
                        name: strain.name,
                        type: strain.type as 'Indica' | 'Sativa' | 'Hybrid',
                        thcContent: strain.thcContent || 0,
                        description: strain.description || undefined,
                      }}
                      userExperience={userExperience ? {
                        liked: userExperience.liked ?? undefined,
                        saved: userExperience.saved || undefined,
                        notes: userExperience.notes ?? undefined
                      } : undefined}
                    />
                  );
                })}
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