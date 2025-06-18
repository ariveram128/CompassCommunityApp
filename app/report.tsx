import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../src/constants/config';
import { useLocation } from '../src/hooks/useLocation';
import { useReports } from '../src/hooks/useReports';

const REPORT_TYPES = [
  { key: 'ICE_CHECKPOINT', label: 'Checkpoint', icon: 'shield' },
  { key: 'ICE_RAID', label: 'Raid', icon: 'alert' },
  { key: 'ICE_PATROL', label: 'Patrol', icon: 'car' },
  { key: 'ICE_DETENTION', label: 'Detention', icon: 'hand-left' },
  { key: 'COMMUNITY_SUPPORT', label: 'Support', icon: 'heart' },
];

const URGENCY_LEVELS = [
  { key: 'low', label: 'Low', color: '#4caf50' },
  { key: 'medium', label: 'Medium', color: '#ff9800' },
  { key: 'high', label: 'High', color: '#f44336' },
];

export default function ReportScreen() {
  const navigation = useNavigation();
  const { location, loading: locationLoading, refreshLocation } = useLocation();
  const { submitReport, loading: reportLoading } = useReports();

  const [type, setType] = useState(REPORT_TYPES[0].key);
  const [urgency, setUrgency] = useState('medium');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const handleTakePhoto = async () => {
    setPhotoLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Camera access is required to take a photo.');
        setPhotoLoading(false);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Camera Error', 'Could not open camera.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Location Required', 'Enable location to submit a report.', [
        { text: 'Enable', onPress: refreshLocation },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    if (!type) {
      Alert.alert('Report Type', 'Please select a report type.');
      return;
    }
    if (!urgency) {
      Alert.alert('Urgency', 'Please select urgency.');
      return;
    }
    // Encourage photo, but allow skip
    if (!photo) {
      Alert.alert(
        'Photo Strongly Recommended',
        'Reports with a photo are more trusted by the community. You can still submit without a photo if you feel unsafe or unable to take one.',
        [
          { text: 'Add Photo', onPress: handleTakePhoto },
          { text: 'Submit Anyway', style: 'destructive', onPress: () => actuallySubmit() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    actuallySubmit();
  };

  const actuallySubmit = async () => {
    const submission = {
      type: CONFIG.REPORT_TYPES[type],
      location,
      description,
      urgency,
      // photo: photo?.base64, // Optionally attach photo (if backend supports)
    };
    const success = await submitReport(submission);
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit a Community Report</Text>
      <Text style={styles.subtitle}>Help keep your community safe. No personal info is collected.</Text>

      {/* Report Type */}
      <Text style={styles.label}>Type of Activity</Text>
      <View style={styles.typeRow}>
        {REPORT_TYPES.map((rt) => (
          <TouchableOpacity
            key={rt.key}
            style={[styles.typeButton, type === rt.key && styles.typeButtonActive]}
            onPress={() => setType(rt.key)}
          >
            <Ionicons name={rt.icon} size={24} color={type === rt.key ? '#fff' : '#aaa'} />
            <Text style={[styles.typeLabel, type === rt.key && { color: '#fff' }]}>{rt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Urgency */}
      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>
        {URGENCY_LEVELS.map((u) => (
          <TouchableOpacity
            key={u.key}
            style={[styles.urgencyButton, urgency === u.key && { backgroundColor: u.color }]}
            onPress={() => setUrgency(u.key)}
          >
            <Text style={[styles.urgencyLabel, urgency === u.key && { color: '#fff' }]}>{u.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Add any details (e.g. vehicle, uniforms, location specifics)"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        maxLength={200}
      />

      {/* Photo Capture */}
      <Text style={styles.label}>Photo (optional, but encouraged)</Text>
      <View style={styles.photoRow}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.photo} />
        ) : (
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            {photoLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="camera" size={28} color="#fff" />
            )}
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Privacy Notice */}
      <View style={styles.privacyBox}>
        <Ionicons name="shield-checkmark" size={18} color="#4caf50" />
        <Text style={styles.privacyText}>
          No personal info is collected. Photos are not linked to your identity. Your safety comes first—never put yourself at risk to take a photo.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, reportLoading && { backgroundColor: '#666' }]}
        onPress={handleSubmit}
        disabled={reportLoading || locationLoading}
      >
        {reportLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="send" size={20} color="#fff" />
        )}
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 18,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
  },
  typeButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  typeLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  urgencyButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  urgencyLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  photoButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    marginTop: 18,
    marginBottom: 18,
    gap: 8,
  },
  privacyText: {
    color: '#aaa',
    fontSize: 12,
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 