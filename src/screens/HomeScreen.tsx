import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { 
  Text, 
  Card, 
  Button, 
  ActivityIndicator,
  Surface,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import apiService from '../services/api';
import StrainCard from '../components/StrainCard';
import { Strain, UserStrainExperience } from '../types';
import type { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // TODO: Get current user ID - for now using a mock user ID
  const currentUserId = 'user-1';

  // Fetch strains from API
  const { data: strains = [], isLoading: strainsLoading } = useQuery({
    queryKey: ['strains'],
    queryFn: () => apiService.getAllStrains(),
  });

  // Fetch user experiences
  const { data: userExperiences = [], isLoading: experiencesLoading } = useQuery({
    queryKey: ['userExperiences', currentUserId],
    queryFn: () => apiService.getUserStrainExperiences(currentUserId),
  });

  // Calculate stats
  const userStrains = strains.filter(strain => 
    userExperiences.some(exp => exp.strainId === strain.id)
  );
  
  const likedStrains = strains.filter(strain =>
    userExperiences.some(exp => exp.strainId === strain.id && exp.liked === true)
  );
  
  const savedStrains = strains.filter(strain =>
    userExperiences.some(exp => exp.strainId === strain.id && exp.saved === true)
  );

  // Get recent strains (last 3 that user has added experiences for)
  const recentUserStrains = userStrains
    .slice()
    .sort((a, b) => {
      const aExp = userExperiences.find(exp => exp.strainId === a.id);
      const bExp = userExperiences.find(exp => exp.strainId === b.id);
      return new Date(bExp?.createdAt || '').getTime() - new Date(aExp?.createdAt || '').getTime();
    })
    .slice(0, 3);

  const renderStrain = (strain: Strain) => {
    const userExperience = userExperiences.find(exp => exp.strainId === strain.id);
    return (
      <StrainCard
        key={strain.id}
        strain={strain}
        userExperience={userExperience}
        onPress={() => navigation.navigate('StrainDetail', { strainId: strain.id })}
      />
    );
  };

  const renderEmptyState = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Welcome to Strain Tracker! 🌿
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Start by adding your first strain to track your cannabis experiences.
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('AddStrain')}
          style={styles.emptyButton}
        >
          Add Your First Strain
        </Button>
      </Card.Content>
    </Card>
  );

  if (strainsLoading || experiencesLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  const hasUserActivity = userStrains.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {!hasUserActivity ? (
        renderEmptyState()
      ) : (
        <>
          {/* Stats Overview */}
          <Surface style={styles.statsContainer}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Your Activity</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  {userStrains.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Strains Tried
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={[styles.statNumber, styles.likedNumber]}>
                  {likedStrains.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Liked
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={[styles.statNumber, styles.savedNumber]}>
                  {savedStrains.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Saved
                </Text>
              </View>
            </View>
          </Surface>

          {/* Quick Actions */}
          <Surface style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('AddStrain')}
                style={styles.actionButton}
              >
                Add Strain
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Browse' as any)}
                style={styles.actionButton}
              >
                Browse All
              </Button>
            </View>
          </Surface>

          {/* Recent Activity */}
          {recentUserStrains.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Recent Activity
                </Text>
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('Browse' as any)}
                >
                  View All
                </Button>
              </View>
              {recentUserStrains.map(renderStrain)}
            </View>
          )}

          {/* Liked Strains */}
          {likedStrains.length > 0 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Favorites ❤️
              </Text>
              {likedStrains.slice(0, 2).map(renderStrain)}
              {likedStrains.length > 2 && (
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('Browse' as any)}
                  style={styles.viewMoreButton}
                >
                  View {likedStrains.length - 2} More Favorites
                </Button>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  statsContainer: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#059669',
  },
  likedNumber: {
    color: '#22c55e',
  },
  savedNumber: {
    color: '#3b82f6',
  },
  statLabel: {
    color: '#6b7280',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewMoreButton: {
    marginTop: 8,
  },
  emptyCard: {
    marginTop: 40,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#059669',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
  },
});