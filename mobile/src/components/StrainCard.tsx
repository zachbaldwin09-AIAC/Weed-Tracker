import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiService from '../services/api';
import { Strain, UserStrainExperience } from '../types';

interface StrainCardProps {
  strain: Strain;
  userExperience?: UserStrainExperience;
  onPress?: () => void;
}

export default function StrainCard({ strain, userExperience, onPress }: StrainCardProps) {
  const queryClient = useQueryClient();
  const currentUserId = 'user-1'; // TODO: Get from auth context

  const saveMutation = useMutation({
    mutationFn: (saved: boolean) =>
      apiService.saveUserStrainExperience({
        userId: currentUserId,
        strainId: strain.id,
        saved,
        liked: userExperience?.liked,
        notes: userExperience?.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userExperiences', currentUserId] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (liked: boolean) =>
      apiService.saveUserStrainExperience({
        userId: currentUserId,
        strainId: strain.id,
        liked,
        saved: userExperience?.saved || false,
        notes: userExperience?.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userExperiences', currentUserId] });
    },
  });

  const handleSave = () => {
    const newSavedState = !userExperience?.saved;
    saveMutation.mutate(newSavedState);
  };

  const handleLike = () => {
    const newLikedState = userExperience?.liked === true ? false : true;
    likeMutation.mutate(newLikedState);
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

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title}>
                {strain.name}
              </Text>
              <Chip
                mode="outlined"
                style={[styles.typeChip, { borderColor: getTypeColor(strain.type) }]}
                textStyle={{ color: getTypeColor(strain.type) }}
              >
                {strain.type}
              </Chip>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon={userExperience?.saved ? "bookmark" : "bookmark-outline"}
                size={20}
                onPress={handleSave}
                iconColor={userExperience?.saved ? "#22c55e" : "#6b7280"}
              />
              <IconButton
                icon={
                  userExperience?.liked === true
                    ? "thumb-up"
                    : userExperience?.liked === false
                    ? "thumb-down"
                    : "thumb-up-outline"
                }
                size={20}
                onPress={handleLike}
                iconColor={
                  userExperience?.liked === true
                    ? "#22c55e"
                    : userExperience?.liked === false
                    ? "#ef4444"
                    : "#6b7280"
                }
              />
            </View>
          </View>

          {strain.thcContent && (
            <Text variant="bodySmall" style={styles.thc}>
              THC: {strain.thcContent}%
            </Text>
          )}

          {strain.description && (
            <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
              {strain.description}
            </Text>
          )}

          {userExperience?.notes && (
            <View style={styles.notesContainer}>
              <Text variant="bodySmall" style={styles.notesLabel}>
                Your notes:
              </Text>
              <Text variant="bodySmall" style={styles.notes} numberOfLines={2}>
                {userExperience.notes}
              </Text>
            </View>
          )}
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  typeChip: {
    alignSelf: 'flex-start',
    height: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thc: {
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    color: '#6b7280',
    marginBottom: 8,
  },
  notesContainer: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  notesLabel: {
    fontWeight: '500',
    marginBottom: 2,
  },
  notes: {
    color: '#4b5563',
    fontStyle: 'italic',
  },
});