import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { StrainSearch } from "@/components/StrainSearch";
import { StrainCard } from "@/components/StrainCard";

// TODO: Remove mock data when implementing real backend
const MOCK_STRAINS = [
  {
    id: "1",
    name: "Blue Dream",
    type: "Hybrid" as const,
    thcContent: 18,
    description: "A balanced hybrid with sweet berry aroma and calming euphoric effects."
  },
  {
    id: "2", 
    name: "OG Kush",
    type: "Indica" as const,
    thcContent: 22,
    description: "Classic strain with earthy, pine flavors and strong relaxing effects."
  },
  {
    id: "3",
    name: "Green Crack",
    type: "Sativa" as const,
    thcContent: 16,
    description: "Energizing sativa with citrus flavors perfect for daytime use."
  },
  {
    id: "4",
    name: "Wedding Cake",
    type: "Hybrid" as const,
    thcContent: 25,
    description: "Potent hybrid with vanilla and tangy flavors, great for relaxation."
  },
  {
    id: "5",
    name: "Jack Herer",
    type: "Sativa" as const,
    thcContent: 19,
    description: "Uplifting sativa named after the cannabis activist, with spicy pine taste."
  },
  {
    id: "6",
    name: "Granddaddy Purple",
    type: "Indica" as const,
    thcContent: 17,
    description: "Classic indica with grape and berry flavors for deep relaxation."
  }
];

// TODO: Remove mock user experiences when implementing real backend
const MOCK_USER_EXPERIENCES = {
  "1": { liked: true, notes: "Great for evening relaxation. Perfect balance!", saved: true },
  "2": { liked: true, notes: "Strong body high, helped with sleep", saved: true },
  "3": { liked: false, notes: "Too energizing for me, made me anxious", saved: false },
  "4": { liked: undefined, notes: "", saved: false },
  "5": { liked: true, notes: "Perfect morning strain, very creative", saved: true },
  "6": { liked: undefined, notes: "", saved: false }
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ type?: string; saved?: boolean }>({});

  const filteredStrains = useMemo(() => {
    return MOCK_STRAINS.filter(strain => {
      // Search filter
      if (searchQuery && !strain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter  
      if (filters.type && strain.type !== filters.type) {
        return false;
      }

      // Saved filter
      if (filters.saved) {
        const userExperience = MOCK_USER_EXPERIENCES[strain.id as keyof typeof MOCK_USER_EXPERIENCES];
        if (!userExperience?.saved) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Search query changed: ${query}`);
  };

  const handleFilterChange = (newFilters: { type?: string; saved?: boolean }) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
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
            {filteredStrains.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {filteredStrains.length} strain{filteredStrains.length !== 1 ? 's' : ''} found
                </p>
                {filteredStrains.map(strain => (
                  <StrainCard
                    key={strain.id}
                    strain={strain}
                    userExperience={MOCK_USER_EXPERIENCES[strain.id as keyof typeof MOCK_USER_EXPERIENCES]}
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
    </div>
  );
}