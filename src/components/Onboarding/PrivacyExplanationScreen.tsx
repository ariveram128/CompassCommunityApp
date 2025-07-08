import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PrivacyExplanationScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function PrivacyExplanationScreen({ onNext, onSkip, onBack }: PrivacyExplanationScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy First</Text>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={styles.iconGradient}>
                <Ionicons name="shield-checkmark" size={64} color="#ffffff" />
              </View>
            </View>
            
            <Text style={styles.title}>Your Privacy Matters</Text>
            <Text style={styles.subtitle}>
              Built with the highest privacy standards for vulnerable communities
            </Text>
          </View>

          {/* Privacy Principles */}
          <View style={styles.principlesSection}>
            <Text style={styles.sectionTitle}>Our Privacy Principles</Text>
            
            <View style={styles.principlesList}>
              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="close-circle" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>Zero Data Collection</Text>
                  <Text style={styles.principleDescription}>
                    We collect absolutely zero personal information. No names, emails, phone numbers, or user accounts.
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="phone-portrait" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>Local-First Storage</Text>
                  <Text style={styles.principleDescription}>
                    All your data stays on your device. Reports and settings never leave your phone.
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#06B6D4' }]}>
                  <Ionicons name="location" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>Location Anonymization</Text>
                  <Text style={styles.principleDescription}>
                    Your precise location is never stored. We use 100m grid squares to protect your privacy.
                  </Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="timer" size={28} color="#ffffff" />
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleTitle}>Automatic Deletion</Text>
                  <Text style={styles.principleDescription}>
                    All reports automatically expire and delete after 4 hours. Nothing is permanent.
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
                <Text style={styles.safeguardsTitle}>Technical Safeguards</Text>
              </View>
              
              <View style={styles.safeguardsList}>
                <View style={styles.safeguardItem}>
                  <Ionicons name="lock-closed" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>Encrypted Storage:</Text> All local data is encrypted using industry-standard algorithms
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="analytics" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>No Analytics:</Text> Zero tracking pixels, crash reports, or usage analytics
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="code-working" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>Open Source:</Text> Code is publicly auditable for transparency
                  </Text>
                </View>

                <View style={styles.safeguardItem}>
                  <Ionicons name="business" size={16} color="#10B981" />
                  <Text style={styles.safeguardText}>
                    <Text style={styles.highlight}>No Third Parties:</Text> No external services, ads, or data brokers
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
                <Text style={styles.legalTitle}>Legal Protection</Text>
              </View>
              
              <Text style={styles.legalText}>
                This app was designed specifically for immigrant and vulnerable communities who may face legal risks. By design, we cannot provide user data to law enforcement or government agencies because <Text style={styles.highlight}>we do not collect it in the first place</Text>.
              </Text>
              
              <Text style={styles.legalSubtext}>
                Your safety and legal protection were our top priorities during development.
              </Text>
            </View>
          </View>

          {/* Data Usage */}
          <View style={styles.dataSection}>
            <Text style={styles.sectionTitle}>What Data We Actually Use</Text>
            
            <View style={styles.dataCard}>
              <View style={styles.dataItem}>
                <View style={styles.dataHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.dataTitle}>Anonymized Location Grid</Text>
                </View>
                <Text style={styles.dataDescription}>
                  ~100m grid squares for community matching (e.g., "Grid 42A" instead of precise coordinates)
                </Text>
              </View>

              <View style={styles.dataItem}>
                <View style={styles.dataHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.dataTitle}>Report Content</Text>
                </View>
                <Text style={styles.dataDescription}>
                  Safety information you choose to share with the community (stored locally only)
                </Text>
              </View>

              <View style={styles.dataItem}>
                <View style={styles.dataHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.dataTitle}>App Preferences</Text>
                </View>
                <Text style={styles.dataDescription}>
                  Settings and preferences to improve your experience (stored locally only)
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Text style={styles.actionText}>
              Ready to experience privacy-first community safety?
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
                <View style={styles.buttonGradient}>
                  <Text style={styles.primaryButtonText}>I Understand</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={onSkip}>
                <Text style={styles.secondaryButtonText}>
                  Read Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.progressText}>Step 4 of 5</Text>
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
  legalSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  dataSection: {
    marginBottom: 32,
  },
  dataCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  dataItem: {
    marginBottom: 16,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 8,
  },
  dataDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginLeft: 28,
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
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
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
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
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
    backgroundColor: '#EF4444',
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