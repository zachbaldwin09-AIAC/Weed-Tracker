import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { 
  Text, 
  Searchbar, 
  FAB, 
  Chip, 
  ActivityIndicator,
  Surface
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import apiService from '../services/api';
import StrainCard from '../components/StrainCard';
import { Strain, UserStrainExperience } from '../types';
import type { RootStackParamList } from '../../App';

type BrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Browse'>;

export default function BrowseScreen() {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // TODO: Get current user ID - for now using a mock user ID
  const currentUserId = 'user-1';

  // Fetch strains from API
  const { data: strains = [], isLoading: strainsLoading, error: strainsError } = useQuery({
    queryKey: ['strains'],
    queryFn: () => apiService.getAllStrains(),
  });

  // Fetch user experiences
  const { data: userExperiences = [] } = useQuery({
    queryKey: ['userExperiences', currentUserId],
    queryFn: () => apiService.getUserStrainExperiences(currentUserId),
  });

  const filteredStrains = useMemo(() => {
    return strains.filter(strain => {
      // Search filter
      if (searchQuery && !strain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (selectedType && strain.type !== selectedType) {
        return false;
      }

      // Saved filter
      if (showSavedOnly) {
        const userExperience = userExperiences.find(exp => exp.strainId === strain.id);
        if (!userExperience || !userExperience.saved) {
          return false;
        }
      }

      return true;
    });
  }, [strains, searchQuery, selectedType, showSavedOnly, userExperiences]);

  const renderStrain = ({ item }: { item: Strain }) => {
    const userExperience = userExperiences.find(exp => exp.strainId === item.id);
    return (
      <StrainCard
        strain={item}
        userExperience={userExperience}
        onPress={() => navigation.navigate('StrainDetail', { strainId: item.id })}
      />
    );
  };

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <Chip
        selected={selectedType === 'Indica'}
        onPress={() => setSelectedType(selectedType === 'Indica' ? null : 'Indica')}
        style={styles.chip}
      >
        Indica
      </Chip>
      <Chip
        selected={selectedType === 'Sativa'}
        onPress={() => setSelectedType(selectedType === 'Sativa' ? null : 'Sativa')}
        style={styles.chip}
      >
        Sativa
      </Chip>
      <Chip
        selected={selectedType === 'Hybrid'}
        onPress={() => setSelectedType(selectedType === 'Hybrid' ? null : 'Hybrid')}
        style={styles.chip}
      >
        Hybrid
      </Chip>
      <Chip
        selected={showSavedOnly}
        onPress={() => setShowSavedOnly(!showSavedOnly)}
        style={styles.chip}
      >
        Saved Only
      </Chip>
    </View>
  );

  if (strainsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading strains...</Text>
      </View>
    );
  }

  if (strainsError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading strains</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.searchSection}>
        <Searchbar
          placeholder="Search strains..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        {renderFilterChips()}
      </Surface>

      <FlatList
        data={filteredStrains}
        renderItem={renderStrain}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No strains found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddStrain')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchSection: {
    padding: 16,
    elevation: 2,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});