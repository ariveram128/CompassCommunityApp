import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

interface LocationPermissionScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onRequestPermission: () => Promise<boolean>;
}

export function LocationPermissionScreen({ 
  onNext, 
  onSkip, 
  onBack, 
  onRequestPermission 
}: LocationPermissionScreenProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { t } = useTranslation();

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const granted = await onRequestPermission();
      if (granted) {
        onNext();
      } else {
        Alert.alert(
          t('errors.permission'),
          t('onboarding.locationPermission.permissionDenied'),
          [
            { text: t('onboarding.locationPermission.actions.continue'), onPress: onNext },
            { text: t('common.retry'), onPress: handleRequestPermission }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('onboarding.locationPermission.permissionError'),
        [{ text: t('onboarding.locationPermission.actions.continue'), onPress: onNext }]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>{t('onboarding.common.skip')}</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={styles.iconGradient}>
                <Ionicons name="location" size={64} color="#ffffff" />
              </View>
            </View>
            
            <Text style={styles.title}>{t('onboarding.locationPermission.title')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.locationPermission.subtitle')}
            </Text>
          </View>

          {/* Why We Need Location */}
          <View style={styles.explanationSection}>
            <Text style={styles.sectionTitle}>{t('onboarding.locationPermission.why.title')}</Text>
            
            <View style={styles.reasonsList}>
              <View style={styles.reasonItem}>
                <View style={[styles.reasonIcon, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
                </View>
                <View style={styles.reasonContent}>
                  <Text style={styles.reasonTitle}>{t('onboarding.locationPermission.why.communitySafety.title')}</Text>
                  <Text style={styles.reasonDescription}>
                    {t('onboarding.locationPermission.why.communitySafety.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.reasonItem}>
                <View style={[styles.reasonIcon, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="notifications" size={24} color="#ffffff" />
                </View>
                <View style={styles.reasonContent}>
                  <Text style={styles.reasonTitle}>{t('onboarding.locationPermission.why.relevantAlerts.title')}</Text>
                  <Text style={styles.reasonDescription}>
                    {t('onboarding.locationPermission.why.relevantAlerts.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.reasonItem}>
                <View style={[styles.reasonIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="map" size={24} color="#ffffff" />
                </View>
                <View style={styles.reasonContent}>
                  <Text style={styles.reasonTitle}>{t('onboarding.locationPermission.why.interactiveMap.title')}</Text>
                  <Text style={styles.reasonDescription}>
                    {t('onboarding.locationPermission.why.interactiveMap.description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Privacy Protection */}
          <View style={styles.privacySection}>
            <View style={styles.privacyCard}>
              <View style={styles.privacyHeader}>
                <Ionicons name="lock-closed" size={28} color="#EF4444" />
                <Text style={styles.privacyTitle}>{t('onboarding.locationPermission.privacy.title')}</Text>
              </View>
              
              <View style={styles.protectionsList}>
                <View style={styles.protectionItem}>
                  <Ionicons name="grid" size={16} color="#10B981" />
                  <Text style={styles.protectionText}>
                    <Text style={styles.highlight}>{t('onboarding.locationPermission.privacy.anonymization.title')}</Text> {t('onboarding.locationPermission.privacy.anonymization.description')}
                  </Text>
                </View>

                <View style={styles.protectionItem}>
                  <Ionicons name="phone-portrait" size={16} color="#10B981" />
                  <Text style={styles.protectionText}>
                    <Text style={styles.highlight}>{t('onboarding.locationPermission.privacy.localStorage.title')}</Text> {t('onboarding.locationPermission.privacy.localStorage.description')}
                  </Text>
                </View>

                <View style={styles.protectionItem}>
                  <Ionicons name="time" size={16} color="#10B981" />
                  <Text style={styles.protectionText}>
                    <Text style={styles.highlight}>{t('onboarding.locationPermission.privacy.autoDelete.title')}</Text> {t('onboarding.locationPermission.privacy.autoDelete.description')}
                  </Text>
                </View>

                <View style={styles.protectionItem}>
                  <Ionicons name="eye-off" size={16} color="#10B981" />
                  <Text style={styles.protectionText}>
                    <Text style={styles.highlight}>{t('onboarding.locationPermission.privacy.noTracking.title')}</Text> {t('onboarding.locationPermission.privacy.noTracking.description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Technical Details */}
          <View style={styles.technicalSection}>
            <TouchableOpacity style={styles.technicalToggle}>
              <Text style={styles.technicalTitle}>{t('onboarding.locationPermission.technical.title')}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            <View style={styles.technicalContent}>
              <Text style={styles.technicalText}>
                {t('onboarding.locationPermission.technical.details')}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, isRequesting && styles.buttonDisabled]}
                onPress={handleRequestPermission}
                disabled={isRequesting}
              >
                <View style={[styles.buttonGradient, isRequesting && { backgroundColor: '#6B7280' }]}>
                  {isRequesting ? (
                    <Text style={styles.primaryButtonText}>{t('onboarding.locationPermission.actions.requesting')}</Text>
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>{t('onboarding.locationPermission.actions.enable')}</Text>
                      <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                    </>
                  )}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={onNext}>
                <Text style={styles.secondaryButtonText}>
                  {t('onboarding.locationPermission.actions.continue')}
                </Text>
                <Text style={styles.secondaryButtonSubtext}>
                  {t('onboarding.locationPermission.actions.limited')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.progressText}>{t('onboarding.locationPermission.progress')}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  explanationSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  reasonsList: {
    gap: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  reasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reasonContent: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  reasonDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  privacySection: {
    marginBottom: 24,
  },
  privacyCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 12,
  },
  protectionsList: {
    gap: 12,
  },
  protectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  protectionText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  highlight: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  technicalSection: {
    marginBottom: 32,
  },
  technicalToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  technicalTitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  technicalContent: {
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  technicalText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  secondaryButtonSubtext: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6366F1',
    width: 24,
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 