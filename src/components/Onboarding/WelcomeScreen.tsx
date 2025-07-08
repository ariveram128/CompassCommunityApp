import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onNext, onSkip }: WelcomeScreenProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={styles.iconGradient}>
                <Ionicons name="shield-checkmark" size={64} color="#ffffff" />
              </View>
            </View>
            
            <Text style={styles.title}>{t('onboarding.welcome.title')}</Text>
            <Text style={styles.appName}>{t('onboarding.welcome.appName')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.welcome.subtitle')}
            </Text>
          </View>

          {/* Mission Statement */}
          <View style={styles.missionSection}>
            <View style={styles.missionCard}>
              <Text style={styles.missionTitle}>{t('onboarding.welcome.mission.title')}</Text>
              <Text style={styles.missionText}>
                {t('onboarding.welcome.mission.description')}
              </Text>
            </View>
          </View>

          {/* Key Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>{t('onboarding.welcome.features.title')}</Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#6366F1' }]}>
                  <Ionicons name="eye-off" size={24} color="#ffffff" />
                </View>
                <Text style={styles.featureTitle}>{t('onboarding.welcome.features.anonymous.title')}</Text>
                <Text style={styles.featureDescription}>
                  {t('onboarding.welcome.features.anonymous.description')}
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="lock-closed" size={24} color="#ffffff" />
                </View>
                <Text style={styles.featureTitle}>{t('onboarding.welcome.features.secure.title')}</Text>
                <Text style={styles.featureDescription}>
                  {t('onboarding.welcome.features.secure.description')}
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="people" size={24} color="#ffffff" />
                </View>
                <Text style={styles.featureTitle}>{t('onboarding.welcome.features.community.title')}</Text>
                <Text style={styles.featureDescription}>
                  {t('onboarding.welcome.features.community.description')}
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="time" size={24} color="#ffffff" />
                </View>
                <Text style={styles.featureTitle}>{t('onboarding.welcome.features.temporary.title')}</Text>
                <Text style={styles.featureDescription}>
                  {t('onboarding.welcome.features.temporary.description')}
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy Promise */}
          <View style={styles.privacySection}>
            <View style={styles.privacyCard}>
              <View style={styles.privacyHeader}>
                <Ionicons name="heart" size={28} color="#EF4444" />
                <Text style={styles.privacyTitle}>{t('onboarding.welcome.promise.title')}</Text>
              </View>
              <Text style={styles.privacyText}>
                {t('onboarding.welcome.promise.description')} <Text style={styles.highlight}>{t('onboarding.welcome.promise.highlight')}</Text> {t('onboarding.welcome.promise.description2')}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Text style={styles.actionText}>
              {t('onboarding.welcome.action.title')}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>{t('onboarding.welcome.action.getStarted')}</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onSkip}>
                <Text style={styles.skipButton}>{t('onboarding.welcome.action.skip')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.progressText}>{t('onboarding.welcome.progress')}</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  appName: {
    fontSize: 32,
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
  missionSection: {
    marginBottom: 32,
  },
  missionCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  privacySection: {
    marginBottom: 32,
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
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 12,
  },
  privacyText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  highlight: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  actionText: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
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
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  skipButton: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
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
    backgroundColor: '#10B981',
    width: 24,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 