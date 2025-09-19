import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  TextInput, 
  Button, 
  Avatar,
  Divider,
  List,
  ActivityIndicator,
  Snackbar 
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import apiService from '../services/api';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const currentUserId = 'user-1'; // TODO: Get from auth context

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch user profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => apiService.getUser(currentUserId),
  });

  // Fetch user experiences for stats
  const { data: userExperiences = [] } = useQuery({
    queryKey: ['userExperiences', currentUserId],
    queryFn: () => apiService.getUserStrainExperiences(currentUserId),
  });

  // Initialize display name when user data loads
  React.useEffect(() => {
    if (user?.displayName && !displayName) {
      setDisplayName(user.displayName);
    }
  }, [user, displayName]);

  const updateProfileMutation = useMutation({
    mutationFn: (profile: { displayName?: string }) =>
      apiService.updateUserProfile(currentUserId, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', currentUserId] });
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarVisible(true);
      setIsEditing(false);
    },
    onError: () => {
      setSnackbarMessage('Failed to update profile');
      setSnackbarVisible(true);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ displayName: displayName.trim() });
  };

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
  };

  // Calculate user stats
  const totalStrains = userExperiences.length;
  const savedStrains = userExperiences.filter(exp => exp.saved).length;
  const likedStrains = userExperiences.filter(exp => exp.liked === true).length;
  const dislikedStrains = userExperiences.filter(exp => exp.liked === false).length;
  const strainsWithNotes = userExperiences.filter(exp => exp.notes?.trim()).length;

  if (userLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Info Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={user?.displayName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
          />
          
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall" style={styles.username}>
              @{user?.username}
            </Text>
            
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  label="Display Name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={styles.displayNameInput}
                  mode="outlined"
                />
                <View style={styles.editButtonContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSaveProfile}
                    loading={updateProfileMutation.isPending}
                    style={styles.saveButton}
                  >
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.displayContainer}>
                <Text variant="titleMedium" style={styles.displayName}>
                  {user?.displayName || 'No display name set'}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setIsEditing(true)}
                  compact
                  style={styles.editButton}
                >
                  Edit Profile
                </Button>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Your Strain Stats
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {totalStrains}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Strains Tried
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={[styles.statNumber, styles.savedColor]}>
                {savedStrains}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Saved
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={[styles.statNumber, styles.likedColor]}>
                {likedStrains}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Liked
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={[styles.statNumber, styles.dislikedColor]}>
                {dislikedStrains}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Disliked
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <List.Item
            title="Strains with Notes"
            description={`${strainsWithNotes} out of ${totalStrains} strains have notes`}
            left={props => <List.Icon {...props} icon="note-text" />}
          />
        </Card.Content>
      </Card>

      {/* Account Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account Information
          </Text>
          
          <List.Item
            title="Username"
            description={user?.username}
            left={props => <List.Icon {...props} icon="account" />}
          />
          
          <List.Item
            title="Display Name"
            description={user?.displayName || 'Not set'}
            left={props => <List.Icon {...props} icon="badge-account" />}
          />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    backgroundColor: '#22c55e',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  editContainer: {
    gap: 12,
  },
  displayNameInput: {
    backgroundColor: '#ffffff',
  },
  editButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6b7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22c55e',
  },
  displayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayName: {
    fontWeight: '500',
  },
  editButton: {
    borderColor: '#22c55e',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 12,
  },
  savedColor: {
    color: '#22c55e',
  },
  likedColor: {
    color: '#059669',
  },
  dislikedColor: {
    color: '#ef4444',
  },
  divider: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});