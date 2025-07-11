import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityMap } from '../src/components/Map';
import { CONFIG } from '../src/constants/config';
import { useLocation } from '../src/hooks/useLocation';
import { useReports } from '../src/hooks/useReports';
import type { CommunityReport } from '../src/services/Report/ReportService';

export default function HomeScreen() {
  const { location, loading, error, refreshLocation } = useLocation();
  const { reports, loading: reportsLoading, generateSampleData, clearAllData } = useReports();
  const [showMap, setShowMap] = useState(true);

  const handleDeveloperMenu = () => {
    if (!__DEV__) return;
    
    Alert.alert(
      'Developer Tools',
      'Choose an action for testing:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate Sample Reports', 
          onPress: () => location && generateSampleData(location)
        },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: clearAllData
        },
        { 
          text: 'Toggle Map', 
          onPress: () => setShowMap(!showMap)
        }
      ]
    );
  };

  const getTimeAgo = (timestamp: number) => {
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (ageHours < 1) return `${Math.round(ageHours * 60)}m ago`;
    return `${Math.round(ageHours)}h ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDeveloperMenu} disabled={!__DEV__}>
            <Text style={styles.title}>Compass Community</Text>
          </TouchableOpacity>
          <Link href="/settings" asChild>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={location ? "shield-checkmark" : "shield-outline"} 
              size={24} 
              color={location ? "#10B981" : "#EF4444"} 
            />
            <Text style={styles.statusTitle}>
              {location ? 'Protected' : 'Setup Required'}
            </Text>
          </View>
          
          {loading ? (
            <Text style={styles.statusText}>Initializing location services...</Text>
          ) : location ? (
            <View>
              <Text style={[styles.statusText, { color: "#10B981" }]}>
                ✓ Community safety monitoring active
              </Text>
              <Text style={styles.statusSubtext}>
                Anonymized location • {reports.length} active reports
              </Text>
            </View>
          ) : (
            <View>
              <Text style={[styles.statusText, { color: "#EF4444" }]}>
                ⚠ Enable location to join the network
              </Text>
              <TouchableOpacity 
                style={styles.enableButton}
                onPress={refreshLocation}
              >
                <Text style={styles.enableButtonText}>Enable Location</Text>
              </TouchableOpacity>
            </View>
          )}

          {error && (
            <Text style={[styles.statusText, { color: "#f44336" }]}>
              Error: {error}
            </Text>
          )}
        </View>

        {/* Community Map */}
        {showMap && location ? (
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Community Map</Text>
            <View style={styles.mapWrapper}>
              <CommunityMap
                userLocation={location}
                reports={reports}
                onReportPress={(report: CommunityReport) => {
                  Alert.alert(
                    'Community Report',
                    `${report.type.replace('_', ' ').toUpperCase()}\n\nReported ${getTimeAgo(report.timestamp)}\n${report.verified ? 'Verified by community' : 'Unverified report'}`,
                    [{ text: 'OK' }]
                  );
                }}
                showAlertRadius={true}
                style={styles.map}
              />
            </View>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color="#6366F1" />
            <Text style={styles.mapPlaceholderText}>
              {location ? 'Interactive Community Map' : 'Enable Location for Map'}
            </Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Shows anonymized alerts within {CONFIG.ALERT_RADIUS_KM}km radius
            </Text>
          </View>
        )}

        {/* Privacy Features */}
        <View style={styles.privacyCard}>
          <Text style={styles.sectionTitle}>🔒 Privacy First Design</Text>
          <View style={styles.privacyFeature}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.privacyText}>Anonymous reporting</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="time" size={16} color="#10B981" />
            <Text style={styles.privacyText}>Auto-delete after 4 hours</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="location" size={16} color="#10B981" />
            <Text style={styles.privacyText}>Location anonymized</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="eye-off" size={16} color="#10B981" />
            <Text style={styles.privacyText}>No tracking</Text>
          </View>
        </View>
      </ScrollView>

      {/* Report Button */}
      <View style={styles.bottomContainer}>
        <Link href="/report" asChild>
          <TouchableOpacity 
            style={[
              styles.reportButton,
              !location && styles.reportButtonDisabled
            ]}
            disabled={!location}
          >
            <Ionicons name="alert-circle" size={24} color="#fff" />
            <Text style={styles.reportButtonText}>Report Activity</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  statusText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 5,
  },
  statusSubtext: {
    color: '#94A3B8',
    fontSize: 12,
  },
  enableButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  mapContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  mapWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    height: 280,
  },
  map: {
    height: 280,
  },
  mapPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapPlaceholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  privacyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  privacyText: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#0F0F23',
  },
  reportButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  reportButtonDisabled: {
    backgroundColor: '#64748B',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 