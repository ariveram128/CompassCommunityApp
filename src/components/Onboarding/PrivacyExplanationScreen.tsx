import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

interface PrivacyExplanationScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function PrivacyExplanationScreen({ onNext, onSkip, onBack }: PrivacyExplanationScreenProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('onboarding.privacy.title')}</Text>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>{t('onboarding.common.skip')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={styles.iconGradient}>
                <Ionicons name="shield-checkmark" size={64} color="#ffffff" />
              </View>
            </View>
            
            <Text style={styles.title}>{t('onboarding.privacy.title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.privacy.subtitle')}</Text>
            <Text style={styles.description}>
              {t('onboarding.privacy.description')}
            </Text>
          </View>

          {/* Privacy Principles */}
          <View style={styles.principlesSection}>
            <Text style={styles.sectionTitle}>{t('onboarding.privacy.principles.title')}</Text>
            
            <View style={styles.principlesList}>
              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="eye-off" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>{t('onboarding.privacy.principles.zeroData.title')}</Text>
                  <Text style={styles.principleDescription}>
                    {t('onboarding.privacy.principles.zeroData.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="phone-portrait" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>{t('onboarding.privacy.principles.localFirst.title')}</Text>
                  <Text style={styles.principleDescription}>
                    {t('onboarding.privacy.principles.localFirst.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#06B6D4' }]}>
                  <Ionicons name="location" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>{t('onboarding.privacy.principles.anonymization.title')}</Text>
                  <Text style={styles.principleDescription}>
                    {t('onboarding.privacy.principles.anonymization.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="timer" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>{t('onboarding.privacy.principles.autoDelete.title')}</Text>
                  <Text style={styles.principleDescription}>
                    {t('onboarding.privacy.principles.autoDelete.description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Technical Safeguards */}
          <View style={styles.safeguardsSection}>
            <View style={styles.safeguardsCard}>
              <View style={styles.safeguardsHeader}>
                <Ionicons name="construct" size={24} color="#F59E0B" />
                <Text style={styles.safeguardsTitle}>{t('onboarding.privacy.safeguards.title')}</Text>
              </View>
              
              <View style={styles.safeguardsList}>
                <View style={styles.safeguardItem}>
                  <Ionicons name="lock-closed" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>{t('onboarding.privacy.safeguards.encryption.title')}</Text> {t('onboarding.privacy.safeguards.encryption.description')}
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="analytics" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>{t('onboarding.privacy.safeguards.analytics.title')}</Text> {t('onboarding.privacy.safeguards.analytics.description')}
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="code-working" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>{t('onboarding.privacy.safeguards.openSource.title')}</Text> {t('onboarding.privacy.safeguards.openSource.description')}
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="business" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>{t('onboarding.privacy.safeguards.thirdParties.title')}</Text> {t('onboarding.privacy.safeguards.thirdParties.description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Legal Context */}
          <View style={styles.legalSection}>
            <View style={styles.legalCard}>
              <View style={styles.legalHeader}>
                <Ionicons name="document-text" size={24} color="#6366F1" />
                <Text style={styles.legalTitle}>{t('onboarding.privacy.legal.title')}</Text>
              </View>
              
              <Text style={styles.legalText}>
                {t('onboarding.privacy.legal.description')} <Text style={styles.highlight}>{t('onboarding.privacy.legal.highlight')}</Text>.
              </Text>
              
              <Text style={styles.legalSubtitle}>
                {t('onboarding.privacy.legal.subtitle')}
              </Text>
            </View>
          </View>

          {/* Data Usage */}
          <View style={styles.dataUsageSection}>
            <Text style={styles.sectionTitle}>{t('onboarding.privacy.dataUsage.title')}</Text>
            
            <View style={styles.dataUsageList}>
              <View style={styles.dataUsageItem}>
                <View style={styles.dataUsageIcon}>
                  <Ionicons name="grid" size={20} color="#6366F1" />
                </View>
                <View style={styles.dataUsageContent}>
                  <Text style={styles.dataUsageTitle}>{t('onboarding.privacy.dataUsage.locationGrid.title')}</Text>
                  <Text style={styles.dataUsageDescription}>
                    {t('onboarding.privacy.dataUsage.locationGrid.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.dataUsageItem}>
                <View style={styles.dataUsageIcon}>
                  <Ionicons name="document-outline" size={20} color="#6366F1" />
                </View>
                <View style={styles.dataUsageContent}>
                  <Text style={styles.dataUsageTitle}>{t('onboarding.privacy.dataUsage.reportContent.title')}</Text>
                  <Text style={styles.dataUsageDescription}>
                    {t('onboarding.privacy.dataUsage.reportContent.description')}
                  </Text>
                </View>
              </View>

              <View style={styles.dataUsageItem}>
                <View style={styles.dataUsageIcon}>
                  <Ionicons name="settings" size={20} color="#6366F1" />
                </View>
                <View style={styles.dataUsageContent}>
                  <Text style={styles.dataUsageTitle}>{t('onboarding.privacy.dataUsage.preferences.title')}</Text>
                  <Text style={styles.dataUsageDescription}>
                    {t('onboarding.privacy.dataUsage.preferences.description')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Text style={styles.actionText}>
            {t('onboarding.privacy.actionText')}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.policyButton} onPress={() => {}}>
              <Ionicons name="document-text" size={20} color="#6366F1" />
              <Text style={styles.policyButtonText}>{t('onboarding.privacy.actions.policy')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.continueButton} onPress={onNext}>
              <Text style={styles.continueButtonText}>{t('onboarding.privacy.actions.understand')}</Text>
              <Ionicons name="chevron-forward" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>{t('onboarding.privacy.progress')}</Text>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
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
  description: {
    fontSize: 15,
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  principlesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  principlesList: {
    gap: 20,
  },
  principleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 16,
    padding: 20,
  },
  principleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  principleContent: {
    flex: 1,
  },
  principleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  principleDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  safeguardsSection: {
    marginBottom: 32,
  },
  safeguardsCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  safeguardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safeguardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 12,
  },
  safeguardsList: {
    gap: 12,
  },
  safeguardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safeguardText: {
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
  legalSection: {
    marginBottom: 32,
  },
  legalCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  legalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    marginLeft: 12,
  },
  legalText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 12,
  },
  legalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  dataUsageSection: {
    marginBottom: 32,
  },
  dataUsageList: {
    gap: 16,
  },
  dataUsageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  dataUsageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dataUsageContent: {
    flex: 1,
  },
  dataUsageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  dataUsageDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 280,
  },
  policyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  policyButtonText: {
    fontSize: 14,
    color: '#6366F1',
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 