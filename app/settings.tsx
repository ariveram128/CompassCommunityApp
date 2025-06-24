import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Privacy Settings Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.cardTitle}>Privacy Settings</Text>
          </View>
          <Text style={styles.cardDescription}>
            Compass Community is designed with privacy first. All data stays on your device and is automatically deleted after 4 hours.
          </Text>
        </View>

        {/* Controls Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>App Controls</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View style={styles.settingHeader}>
                <Ionicons name="location" size={20} color="#6366F1" />
                <Text style={styles.settingTitle}>Location Services</Text>
              </View>
              <Text style={styles.settingDescription}>
                Required for safety alerts in your area. Location is anonymized to ~100m grid.
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#3D3D73', true: '#6366F1' }}
              thumbColor={locationEnabled ? '#ffffff' : '#CBD5E1'}
              ios_backgroundColor="#3D3D73"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View style={styles.settingHeader}>
                <Ionicons name="notifications" size={20} color="#6366F1" />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Text style={styles.settingDescription}>
                Get critical alerts about nearby community activity. Only emergency notifications are sent.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3D3D73', true: '#6366F1' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#CBD5E1'}
              ios_backgroundColor="#3D3D73"
            />
          </View>
        </View>

        {/* Privacy Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={styles.cardTitle}>How We Protect Your Privacy</Text>
          </View>
          
          <View style={styles.privacyFeatures}>
            <View style={styles.privacyFeature}>
              <Ionicons name="phone-portrait" size={16} color="#10B981" />
              <Text style={styles.privacyText}>Reports are stored locally on your device only</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Ionicons name="location" size={16} color="#10B981" />
              <Text style={styles.privacyText}>Location data is anonymized to ~100m grid</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Ionicons name="eye-off" size={16} color="#10B981" />
              <Text style={styles.privacyText}>No personal information is ever collected</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Ionicons name="time" size={16} color="#10B981" />
              <Text style={styles.privacyText}>All data automatically expires after 4 hours</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Ionicons name="finger-print" size={16} color="#10B981" />
              <Text style={styles.privacyText}>Anonymous device IDs for rate limiting only</Text>
            </View>
            <View style={styles.privacyFeature}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={styles.privacyText}>End-to-end privacy by design</Text>
            </View>
          </View>
        </View>

        {/* App Information Card */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>About Compass Community</Text>
          </View>
          <Text style={styles.aboutText}>
            A privacy-first community safety app designed to help communities stay informed and protected. 
            Built with love for community safety and digital rights.
          </Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 0.1.0 (Development Build)</Text>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 12,
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
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  settingDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  privacyFeatures: {
    gap: 16,
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyText: {
    fontSize: 14,
    color: '#CBD5E1',
    flex: 1,
    lineHeight: 20,
  },
  aboutText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
}); 