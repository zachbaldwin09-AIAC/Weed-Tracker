import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Snackbar } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import apiService from '../services/api';
import { InsertStrain } from '../types';
import type { RootStackParamList } from '../../App';

type AddStrainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddStrain'>;

export default function AddStrainScreen() {
  const navigation = useNavigation<AddStrainScreenNavigationProp>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<InsertStrain>({
    name: '',
    type: 'Hybrid',
    thcContent: undefined,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const createStrainMutation = useMutation({
    mutationFn: (strain: InsertStrain) => apiService.createStrain(strain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strains'] });
      setSnackbarMessage('Strain added successfully!');
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    },
    onError: (error: any) => {
      if (error.message.includes('409')) {
        setErrors({ name: 'A strain with this name already exists' });
      } else {
        setSnackbarMessage('Failed to add strain. Please try again.');
        setSnackbarVisible(true);
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Strain name is required';
    }

    if (formData.thcContent !== undefined && (formData.thcContent < 0 || formData.thcContent > 100)) {
      newErrors.thcContent = 'THC content must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    };

    createStrainMutation.mutate(submitData);
  };

  const typeOptions = [
    { value: 'Indica', label: 'Indica' },
    { value: 'Sativa', label: 'Sativa' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <Text variant="bodyLarge" style={styles.sectionTitle}>
          Basic Information
        </Text>

        <TextInput
          label="Strain Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          error={!!errors.name}
          style={styles.input}
          mode="outlined"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text variant="bodyMedium" style={styles.label}>
          Type *
        </Text>
        <SegmentedButtons
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          buttons={typeOptions}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="THC Content (%)"
          value={formData.thcContent?.toString() || ''}
          onChangeText={(text) => {
            const num = text ? parseInt(text, 10) : undefined;
            setFormData({ ...formData, thcContent: num });
          }}
          keyboardType="numeric"
          error={!!errors.thcContent}
          style={styles.input}
          mode="outlined"
        />
        {errors.thcContent && <Text style={styles.errorText}>{errors.thcContent}</Text>}

        <TextInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
          mode="outlined"
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={createStrainMutation.isPending}
            disabled={createStrainMutation.isPending}
            style={[styles.button, styles.submitButton]}
          >
            Add Strain
          </Button>
        </View>
      </View>

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
  },
  form: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#6b7280',
  },
  submitButton: {
    backgroundColor: '#22c55e',
  },
});