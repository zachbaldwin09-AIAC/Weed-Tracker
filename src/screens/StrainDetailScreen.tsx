import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  IconButton, 
  TextInput, 
  Button,
  ActivityIndicator,
  Snackbar 
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import apiService from '../services/api';
import { Strain, UserStrainExperience } from '../types';
import type { RootStackParamList } from '../../App';

type StrainDetailScreenRouteProp = RouteProp<RootStackParamList, 'StrainDetail'>;
type StrainDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StrainDetail'>;

export default function StrainDetailScreen() {
  const route = useRoute<StrainDetailScreenRouteProp>();
  const navigation = useNavigation<StrainDetailScreenNavigationProp>();
  const queryClient = useQueryClient();
  const { strainId } = route.params;

  const currentUserId = 'user-1'; // TODO: Get from auth context
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch strains to get this specific strain
  const { data: strains = [], isLoading: strainsLoading } = useQuery({
    queryKey: ['strains'],
    queryFn: () => apiService.getAllStrains(),
  });

  // Fetch user experiences
  const { data: userExperiences = [] } = useQuery({
    queryKey: ['userExperiences', currentUserId],
    queryFn: () => apiService.getUserStrainExperiences(currentUserId),
  });

  const strain = strains.find(s => s.id === strainId);
  const userExperience = userExperiences.find(exp => exp.strainId === strainId);

  // Initialize notes when component mounts or when userExperience changes
  React.useEffect(() => {
    if (userExperience?.notes && !notes) {
      setNotes(userExperience.notes);
    }
  }, [userExperience, notes]);

  const experienceMutation = useMutation({
    mutationFn: (experience: Partial<UserStrainExperience>) =>
      apiService.saveUserStrainExperience({
        userId: currentUserId,
        strainId,
        liked: experience.liked ?? userExperience?.liked,
        saved: experience.saved ?? userExperience?.saved ?? false,
        notes: experience.notes ?? userExperience?.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userExperiences', currentUserId] });
      setSnackbarMessage('Experience updated!');
      setSnackbarVisible(true);
    },
    onError: () => {
      setSnackbarMessage('Failed to update experience');
      setSnackbarVisible(true);
    },
  });

  const handleLike = (liked: boolean) => {
    experienceMutation.mutate({ liked });
  };

  const handleSave = () => {
    const newSavedState = !userExperience?.saved;
    experienceMutation.mutate({ saved: newSavedState });
  };

  const handleSaveNotes = () => {
    experienceMutation.mutate({ notes: notes.trim() });
    setIsEditingNotes(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Indica':
        return '#8b5cf6';
      case 'Sativa':
        return '#f59e0b';
      case 'Hybrid':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  if (strainsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading strain details...</Text>
      </View>
    );
  }

  if (!strain) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Strain not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text variant="headlineSmall" style={styles.title}>
                {strain.name}
              </Text>
              <Chip
                mode="outlined"
                style={[styles.typeChip, { borderColor: getTypeColor(strain.type) }]}
                textStyle={{ color: getTypeColor(strain.type), fontWeight: '600' }}
              >
                {strain.type}
              </Chip>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon={userExperience?.saved ? "bookmark" : "bookmark-outline"}
                size={24}
                onPress={handleSave}
                iconColor={userExperience?.saved ? "#22c55e" : "#6b7280"}
              />
            </View>
          </View>

          {strain.thcContent && (
            <Text variant="bodyLarge" style={styles.thc}>
              THC Content: {strain.thcContent}%
            </Text>
          )}

          {strain.description && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {strain.description}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Your Experience
          </Text>

          <View style={styles.ratingContainer}>
            <Text variant="bodyMedium" style={styles.ratingLabel}>
              Did you like this strain?
            </Text>
            <View style={styles.ratingButtons}>
              <IconButton
                icon="thumb-up"
                size={32}
                mode={userExperience?.liked === true ? "contained" : "outlined"}
                onPress={() => handleLike(true)}
                iconColor={userExperience?.liked === true ? "#ffffff" : "#22c55e"}
                containerColor={userExperience?.liked === true ? "#22c55e" : "transparent"}
              />
              <IconButton
                icon="thumb-down"
                size={32}
                mode={userExperience?.liked === false ? "contained" : "outlined"}
                onPress={() => handleLike(false)}
                iconColor={userExperience?.liked === false ? "#ffffff" : "#ef4444"}
                containerColor={userExperience?.liked === false ? "#ef4444" : "transparent"}
              />
            </View>
          </View>

          <View style={styles.notesSection}>
            <View style={styles.notesTitleContainer}>
              <Text variant="bodyMedium" style={styles.notesLabel}>
                Your Notes
              </Text>
              {!isEditingNotes && (
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => setIsEditingNotes(true)}
                />
              )}
            </View>

            {isEditingNotes ? (
              <View style={styles.notesEditContainer}>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add your personal notes about this strain..."
                  multiline
                  numberOfLines={4}
                  style={styles.notesInput}
                  mode="outlined"
                />
                <View style={styles.notesButtonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setNotes(userExperience?.notes || '');
                      setIsEditingNotes(false);
                    }}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSaveNotes}
                    loading={experienceMutation.isPending}
                    style={styles.saveButton}
                  >
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.notesDisplayContainer}>
                {userExperience?.notes ? (
                  <Text variant="bodyMedium" style={styles.notesText}>
                    {userExperience.notes}
                  </Text>
                ) : (
                  <Text variant="bodyMedium" style={styles.placeholderText}>
                    No notes yet. Tap the pencil icon to add your thoughts about this strain.
                  </Text>
                )}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  actions: {
    alignItems: 'center',
  },
  thc: {
    color: '#059669',
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    lineHeight: 20,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  notesSection: {
    marginTop: 8,
  },
  notesTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notesLabel: {
    fontWeight: '500',
  },
  notesEditContainer: {
    gap: 12,
  },
  notesInput: {
    backgroundColor: '#ffffff',
  },
  notesButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6b7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22c55e',
  },
  notesDisplayContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
  },
  notesText: {
    color: '#4b5563',
  },
  placeholderText: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 16,
  },
});