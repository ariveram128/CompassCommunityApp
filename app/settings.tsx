import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationService } from '../src/services/Notification/NotificationService';

export default function SettingsScreen() {
  const [notificationPrefs, setNotificationPrefs] = React.useState(NotificationService.getPreferences());

  const updateNotificationPref = async (key: string, value: boolean) => {
    const newPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(newPrefs);
    await NotificationService.updatePreferences({ [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
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

        {/* Notification Settings Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Push Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View style={styles.settingHeader}>
                <Ionicons name="notifications" size={20} color="#6366F1" />
                <Text style={styles.settingTitle}>Enable Notifications</Text>
              </View>
              <Text style={styles.settingDescription}>
                Receive alerts about community activity in your area
              </Text>
            </View>
            <Switch
              value={notificationPrefs.enabled}
              onValueChange={(value) => updateNotificationPref('enabled', value)}
              trackColor={{ false: '#3D3D73', true: '#6366F1' }}
              thumbColor={notificationPrefs.enabled ? '#ffffff' : '#CBD5E1'}
              ios_backgroundColor="#3D3D73"
            />
          </View>

          {notificationPrefs.enabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={styles.settingTitle}>High Priority Alerts</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Critical safety alerts within 3km (raids, detentions)
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.highPriorityEnabled}
                  onValueChange={(value) => updateNotificationPref('highPriorityEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#EF4444' }}
                  thumbColor={notificationPrefs.highPriorityEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="warning" size={20} color="#F59E0B" />
                    <Text style={styles.settingTitle}>Standard Alerts</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    General community alerts within 8km (checkpoints, patrols)
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.standardAlertsEnabled}
                  onValueChange={(value) => updateNotificationPref('standardAlertsEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#F59E0B' }}
                  thumbColor={notificationPrefs.standardAlertsEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="heart" size={20} color="#10B981" />
                    <Text style={styles.settingTitle}>Community Support</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Support requests and community updates
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.communityUpdatesEnabled}
                  onValueChange={(value) => updateNotificationPref('communityUpdatesEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#10B981' }}
                  thumbColor={notificationPrefs.communityUpdatesEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="volume-high" size={20} color="#6366F1" />
                    <Text style={styles.settingTitle}>Sound Alerts</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Play sound when receiving notifications
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.soundEnabled}
                  onValueChange={(value) => updateNotificationPref('soundEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#6366F1' }}
                  thumbColor={notificationPrefs.soundEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="phone-portrait" size={20} color="#6366F1" />
                    <Text style={styles.settingTitle}>Vibration</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Vibrate device for notifications
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.vibrationEnabled}
                  onValueChange={(value) => updateNotificationPref('vibrationEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#6366F1' }}
                  thumbColor={notificationPrefs.vibrationEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingContent}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="moon" size={20} color="#6366F1" />
                    <Text style={styles.settingTitle}>Quiet Hours</Text>
                  </View>
                  <Text style={styles.settingDescription}>
                    Disable non-critical notifications during quiet hours (22:00 - 08:00)
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.quietHoursEnabled}
                  onValueChange={(value) => updateNotificationPref('quietHoursEnabled', value)}
                  trackColor={{ false: '#3D3D73', true: '#6366F1' }}
                  thumbColor={notificationPrefs.quietHoursEnabled ? '#ffffff' : '#CBD5E1'}
                  ios_backgroundColor="#3D3D73"
                />
              </View>
            </>
          )}
        </View>

        {/* App Controls Card */}
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
            <View style={styles.statusIndicator}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.statusText}>Active</Text>
            </View>
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
              <Ionicons name="notifications-off" size={16} color="#10B981" />
              <Text style={styles.privacyText}>Notifications contain no personal details</Text>
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
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