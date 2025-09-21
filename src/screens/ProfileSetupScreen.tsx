import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Portal, Modal } from 'react-native-paper';
// Using a simple button for state selection instead of Picker
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';

interface ProfileSetupScreenProps {
  onComplete?: (userId: string) => void;
}

const US_STATES = [
  '', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export default function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [homeState, setHomeState] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);

  const createProfileMutation = useMutation({
    mutationFn: (profile: { username: string; displayName?: string; homeState?: string }) =>
      apiService.createUserProfile(profile),
    onSuccess: (user) => {
      Alert.alert(
        'Welcome!',
        `Your profile has been created successfully, ${user.displayName || user.username}!`,
        [{ text: 'Get Started', onPress: () => {
          if (onComplete) {
            onComplete(user.id);
          } else {
            // Navigate to Home screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }}]
      );
    },
    onError: (error: any) => {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    },
  });

  const handleCreateProfile = () => {
    if (!username.trim()) {
      Alert.alert('Username Required', 'Please enter a username to continue.');
      return;
    }

    const profile = {
      username: username.trim(),
      displayName: displayName.trim() || undefined,
      homeState: homeState || undefined,
    };

    createProfileMutation.mutate(profile);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title} variant="headlineMedium">
            Welcome to Weed Tracker!
          </Text>
          <Text style={styles.subtitle} variant="bodyMedium">
            Let's set up your profile to get started tracking your cannabis experiences.
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Username *"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              placeholder="Choose a unique username"
              autoCapitalize="none"
              autoCorrect={false}
              data-testid="input-username"
            />

            <TextInput
              label="Display Name (Optional)"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              style={styles.input}
              placeholder="How you'd like to be called"
              data-testid="input-display-name"
            />

            <Button
              mode="outlined"
              onPress={() => setShowStatePicker(true)}
              style={styles.input}
              contentStyle={styles.stateButton}
              data-testid="button-select-state"
            >
              <Text>{homeState || 'Select Home State (Optional)'}</Text>
            </Button>

            <Text style={styles.note} variant="bodySmall">
              * Required fields
            </Text>
            <Text style={styles.note} variant="bodySmall">
              Your home state is optional and helps us provide location-relevant information.
            </Text>
          </View>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleCreateProfile}
            loading={createProfileMutation.isPending}
            disabled={createProfileMutation.isPending || !username.trim()}
            style={styles.createButton}
            data-testid="button-create-profile"
          >
            Create Profile
          </Button>
        </Card.Actions>
      </Card>

      {/* State Picker Modal */}
      <Portal>
        <Modal
          visible={showStatePicker}
          onDismiss={() => setShowStatePicker(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Select Your Home State" />
            <Card.Content>
              <ScrollView style={{ maxHeight: 300 }}>
                {US_STATES.map((state, index) => (
                  <Button
                    key={index}
                    mode={homeState === state ? "contained" : "text"}
                    onPress={() => setHomeState(state)}
                    style={styles.stateOption}
                    data-testid={`button-state-${state || 'none'}`}
                  >
                    {state || 'No state selected'}
                  </Button>
                ))}
              </ScrollView>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setShowStatePicker(false)} data-testid="button-confirm-state">
                Done
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    marginVertical: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  stateButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  note: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  actions: {
    padding: 16,
    justifyContent: 'center',
  },
  createButton: {
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
  },
  stateOption: {
    marginVertical: 2,
  },
});