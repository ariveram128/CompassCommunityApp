import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  const PrivacyPolicyContent = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Privacy-First Commitment</Text>
      <Text style={styles.paragraph}>
        Compass Community is built with privacy as our foundational principle. We do not collect, store, or transmit any personally identifiable information (PII).
      </Text>

      <Text style={styles.sectionTitle}>What We Don&apos;t Collect</Text>
      <Text style={styles.bulletPoint}>• No personal information (names, emails, phone numbers)</Text>
      <Text style={styles.bulletPoint}>• No account creation required</Text>
      <Text style={styles.bulletPoint}>• No user tracking across sessions</Text>
      <Text style={styles.bulletPoint}>• No behavioral analytics or user profiles</Text>
      <Text style={styles.bulletPoint}>• No third-party tracking services</Text>

      <Text style={styles.sectionTitle}>Anonymous Processing</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Location Data:</Text> Automatically anonymized to ~100m grid, processed locally only
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Community Reports:</Text> Submitted anonymously, auto-delete after 4 hours
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Verification System:</Text> Anonymous participation with no personal profiles
      </Text>

      <Text style={styles.sectionTitle}>Local Storage Only</Text>
      <Text style={styles.bulletPoint}>• All data stored locally on your device</Text>
      <Text style={styles.bulletPoint}>• No data transmitted to external servers</Text>
      <Text style={styles.bulletPoint}>• Industry-standard encryption</Text>
      <Text style={styles.bulletPoint}>• Automatic data purging</Text>

      <Text style={styles.sectionTitle}>Your Controls</Text>
      <Text style={styles.bulletPoint}>• Disable location services anytime</Text>
      <Text style={styles.bulletPoint}>• Clear all local data</Text>
      <Text style={styles.bulletPoint}>• Control all notification types</Text>
      <Text style={styles.bulletPoint}>• Uninstall removes all data</Text>

      <Text style={styles.highlight}>
        Summary: We protect your privacy by not collecting your personal information in the first place.
      </Text>
    </ScrollView>
  );

  const TermsOfServiceContent = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Community Safety Mission</Text>
      <Text style={styles.paragraph}>
        Compass Community enhances community safety through anonymous, privacy-respecting information sharing.
      </Text>

      <Text style={styles.sectionTitle}>Permitted Uses</Text>
      <Text style={styles.bulletPoint}>• Report legitimate community safety concerns</Text>
      <Text style={styles.bulletPoint}>• Receive location-based safety alerts</Text>
      <Text style={styles.bulletPoint}>• Verify reports you have personally witnessed</Text>
      <Text style={styles.bulletPoint}>• Access community safety information</Text>

      <Text style={styles.sectionTitle}>Prohibited Uses</Text>
      <Text style={styles.bulletPoint}>• Submit false or misleading reports</Text>
      <Text style={styles.bulletPoint}>• Attempt to identify or track other users</Text>
      <Text style={styles.bulletPoint}>• Use for commercial purposes</Text>
      <Text style={styles.bulletPoint}>• Submit harassing or discriminatory content</Text>
      <Text style={styles.bulletPoint}>• Use for illegal purposes</Text>

      <Text style={styles.sectionTitle}>Reporting Guidelines</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Good Faith:</Text> Reports must be based on actual observations
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Safety Focus:</Text> Content should relate to legitimate safety concerns
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Respectful:</Text> Maintain respectful communication
      </Text>

      <Text style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠ Emergency Notice</Text>{'\n'}
        This app is NOT an emergency service. For immediate emergencies, always call local emergency services (911 in US).
      </Text>

      <Text style={styles.sectionTitle}>Community Standards</Text>
      <Text style={styles.bulletPoint}>• Participate for community benefit</Text>
      <Text style={styles.bulletPoint}>• Verify only reports you can reasonably confirm</Text>
      <Text style={styles.bulletPoint}>• Respect others&apos; privacy and safety</Text>
      <Text style={styles.bulletPoint}>• Follow all applicable laws</Text>

      <Text style={styles.highlight}>
        By using Compass Community, you agree to these terms and our privacy-first approach.
      </Text>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Legal & Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
        >
          <Ionicons 
            name="shield-checkmark" 
            size={20} 
            color={activeTab === 'privacy' ? '#6366F1' : '#94A3B8'} 
          />
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
        >
          <Ionicons 
            name="document-text" 
            size={20} 
            color={activeTab === 'terms' ? '#6366F1' : '#94A3B8'} 
          />
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'privacy' ? <PrivacyPolicyContent /> : <TermsOfServiceContent />}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last Updated: July 2025
        </Text>
        <Text style={styles.footerSubtext}>
          🔒 Privacy-first design • Community safety focused
        </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bold: {
    fontWeight: '600',
    color: '#fff',
  },
  highlight: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 