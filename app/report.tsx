import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONFIG } from '../src/constants/config';
import { useLocation } from '../src/hooks/useLocation';
import { useReports } from '../src/hooks/useReports';

const REPORT_TYPES = [
  { key: 'ICE_CHECKPOINT', label: 'Checkpoint', icon: 'shield-outline' as const, color: '#F59E0B' },
  { key: 'ICE_RAID', label: 'Raid', icon: 'alert-outline' as const, color: '#EF4444' },
  { key: 'ICE_PATROL', label: 'Patrol', icon: 'car-outline' as const, color: '#F59E0B' },
  { key: 'ICE_DETENTION', label: 'Detention', icon: 'hand-left-outline' as const, color: '#DC2626' },
  { key: 'COMMUNITY_SUPPORT', label: 'Support', icon: 'heart-outline' as const, color: '#10B981' },
];

const URGENCY_LEVELS = [
  { key: 'low', label: 'Low', color: '#10B981', icon: 'information-circle' as const },
  { key: 'medium', label: 'Medium', color: '#F59E0B', icon: 'warning' as const },
  { key: 'high', label: 'High', color: '#EF4444', icon: 'alert-circle' as const },
];

export default function ReportScreen() {
  const navigation = useNavigation();
  const { location, loading: locationLoading, refreshLocation } = useLocation();
  const { submitReport, loading: reportLoading } = useReports();

  const [type, setType] = useState(REPORT_TYPES[0].key);
  const [urgency, setUrgency] = useState('medium');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
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
    if (!location) return;
    
    const submission = {
      type: type as keyof typeof CONFIG.REPORT_TYPES,
      location,
      description,
      urgency: urgency as 'low' | 'medium' | 'high',
      // photo: photo?.base64, // Optionally attach photo (if backend supports)
    };
    const success = await submitReport(submission);
    if (success) {
      navigation.goBack();
    }
  };

  const selectedType = REPORT_TYPES.find(rt => rt.key === type);
  const selectedUrgency = URGENCY_LEVELS.find(u => u.key === urgency);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Activity</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Introduction Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.cardTitle}>Submit Community Report</Text>
          </View>
          <Text style={styles.cardDescription}>
            Help keep your community safe and informed. No personal information is collected and all reports are anonymous.
          </Text>
        </View>

        {/* Report Type Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Type of Activity</Text>
          <Text style={styles.sectionSubtitle}>Select the type of activity you want to report</Text>
          
          <View style={styles.typeGrid}>
            {REPORT_TYPES.map((rt) => (
              <TouchableOpacity
                key={rt.key}
                style={[
                  styles.typeButton,
                  type === rt.key && [styles.typeButtonActive, { borderColor: rt.color }]
                ]}
                onPress={() => setType(rt.key)}
              >
                <View style={[
                  styles.typeIconContainer,
                  type === rt.key && { backgroundColor: `${rt.color}20` }
                ]}>
                  <Ionicons 
                    name={rt.icon} 
                    size={24} 
                    color={type === rt.key ? rt.color : '#6366F1'} 
                  />
                </View>
                <Text style={[
                  styles.typeLabel,
                  type === rt.key && { color: '#fff', fontWeight: '600' }
                ]}>
                  {rt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Urgency Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <Text style={styles.sectionSubtitle}>How urgent is this situation?</Text>
          
          <View style={styles.urgencyRow}>
            {URGENCY_LEVELS.map((u) => (
              <TouchableOpacity
                key={u.key}
                style={[
                  styles.urgencyButton,
                  urgency === u.key && [styles.urgencyButtonActive, { backgroundColor: u.color }]
                ]}
                onPress={() => setUrgency(u.key)}
              >
                <Ionicons 
                  name={u.icon} 
                  size={18} 
                  color={urgency === u.key ? '#fff' : u.color} 
                />
                <Text style={[
                  styles.urgencyLabel,
                  urgency === u.key && { color: '#fff', fontWeight: '600' }
                ]}>
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Add any relevant details that might help the community
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="e.g., vehicle descriptions, uniforms, specific location details..."
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{description.length}/200 characters</Text>
        </View>

        {/* Photo Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photo Evidence (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Photos help verify reports but only add if it's safe to do so
          </Text>
          
          <View style={styles.photoContainer}>
            {photo ? (
              <View style={styles.photoPreview}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => setPhoto(null)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                {photoLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="camera" size={32} color="#fff" />
                )}
                <Text style={styles.photoButtonText}>
                  {photoLoading ? 'Opening Camera...' : 'Take Photo'}
                </Text>
                <Text style={styles.photoButtonSubtext}>Tap to capture evidence</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Safety Notice Card */}
        <View style={[styles.card, styles.safetyCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.safetyTitle}>Your Safety Comes First</Text>
          </View>
          <View style={styles.safetyPoints}>
            <View style={styles.safetyPoint}>
              <Ionicons name="eye-off" size={14} color="#10B981" />
              <Text style={styles.safetyText}>No personal info collected</Text>
            </View>
            <View style={styles.safetyPoint}>
              <Ionicons name="location" size={14} color="#10B981" />
              <Text style={styles.safetyText}>Location anonymized to ~100m</Text>
            </View>
            <View style={styles.safetyPoint}>
              <Ionicons name="camera" size={14} color="#10B981" />
              <Text style={styles.safetyText}>Photos not linked to identity</Text>
            </View>
            <View style={styles.safetyPoint}>
              <Ionicons name="alert-circle" size={14} color="#F59E0B" />
              <Text style={styles.safetyText}>Never risk your safety for a photo</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!location || reportLoading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={reportLoading || locationLoading || !location}
        >
          {reportLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
        
        {!location && (
          <Text style={styles.locationWarning}>
            ⚠ Location required to submit reports
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 20,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '47%',
    minHeight: 75,
  },
  typeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  typeLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  urgencyButtonActive: {
    borderColor: 'transparent',
  },
  urgencyLabel: {
    color: '#CBD5E1',
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 14,
    lineHeight: 20,
  },
  characterCount: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  photoButtonSubtext: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 4,
  },
  photoPreview: {
    position: 'relative',
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 100,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  safetyPoints: {
    gap: 12,
    marginTop: 8,
  },
  safetyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safetyText: {
    color: '#CBD5E1',
    fontSize: 14,
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#0F0F23',
  },
  submitButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#64748B',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  locationWarning: {
    color: '#F59E0B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
}); 