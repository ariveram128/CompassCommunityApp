import { Ionicons } from '@expo/vector-icons';
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

  const handleReportPress = () => {
    if (!location) {
      Alert.alert(
        'Location Required',
        'Please enable location access to submit reports',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: refreshLocation }
        ]
      );
      return;
    }
    // For now, just show an alert - we'll create the report screen next
    Alert.alert('Report Feature', 'Report submission screen coming soon!');
  };

  const handleSettingsPress = () => {
    // For now, just show an alert - we'll create the settings screen next
    Alert.alert('Settings', 'Privacy settings screen coming soon!');
  };

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

  const getRecentReports = () => {
    if (!location) return [];
    
    // Filter reports to only show those within alert radius
    return reports
      .filter(report => {
        if (!location?.latitude || !location?.longitude) return false;
        // This is a simplified distance check - in production you'd use the LocationService
        const latDiff = Math.abs(report.location.latitude - location.latitude);
        const lonDiff = Math.abs(report.location.longitude - location.longitude);
        const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        return roughDistance < 0.1; // Rough approximation of 8km
      })
      .slice(0, 5) // Show last 5 reports
      .map(report => ({
        type: report.type.replace('_', ' ').toUpperCase(),
        timeAgo: getTimeAgo(report.timestamp),
        priority: report.priority,
        verified: report.verified
      }));
  };

  const getTimeAgo = (timestamp: number) => {
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (ageHours < 1) return `${Math.round(ageHours * 60)}m ago`;
    return `${Math.round(ageHours)}h ago`;
  };

  const recentReports = getRecentReports();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDeveloperMenu} disabled={!__DEV__}>
            <Text style={styles.title}>Compass Community</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Location Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={location ? "location" : "location-outline"} 
              size={20} 
              color={location ? "#4CAF50" : "#ff6b35"} 
            />
            <Text style={styles.statusTitle}>Location Status</Text>
          </View>
          
          {loading ? (
            <Text style={styles.statusText}>Getting location...</Text>
          ) : location ? (
            <View>
              <Text style={[styles.statusText, { color: "#4CAF50" }]}>
                ✓ Location services active
              </Text>
              <Text style={styles.statusSubtext}>
                Anonymized to protect your privacy • {reports.length} community reports active
              </Text>
            </View>
          ) : (
            <View>
              <Text style={[styles.statusText, { color: "#ff6b35" }]}>
                ⚠ Location access required
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
            <View style={styles.mapOverlay}>
              <Text style={styles.mapStatus}>
                {reportsLoading ? 'Loading reports...' : `${reports.length} active reports`}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color="#666" />
            <Text style={styles.mapPlaceholderText}>
              {location ? 'Interactive map will load here' : 'Enable location to view community map'}
            </Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Shows anonymized community alerts within {CONFIG.ALERT_RADIUS_KM}km
            </Text>
          </View>
        )}

        {/* Privacy Features */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy First</Text>
          <View style={styles.privacyFeature}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.privacyText}>Anonymous reporting</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="time" size={16} color="#4CAF50" />
            <Text style={styles.privacyText}>Auto-delete after 4 hours</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.privacyText}>Location data anonymized</Text>
          </View>
          <View style={styles.privacyFeature}>
            <Ionicons name="eye-off" size={16} color="#4CAF50" />
            <Text style={styles.privacyText}>No tracking or identification</Text>
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.reportsCard}>
          <Text style={styles.reportsTitle}>Recent Community Reports</Text>
          {recentReports.length === 0 ? (
            <Text style={styles.noReportsText}>
              No recent reports in your area
            </Text>
          ) : (
            recentReports.map((report, index) => (
              <View key={index} style={styles.reportItem}>
                <View style={styles.reportContent}>
                  <Text style={styles.reportText}>{report.type}</Text>
                  {report.verified && (
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  )}
                </View>
                <Text style={[
                  styles.reportTime,
                  report.priority === 'high' && { color: '#f44336' }
                ]}>
                  {report.timeAgo}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Report Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.reportButton,
            !location && styles.reportButtonDisabled
          ]}
          onPress={handleReportPress}
          disabled={!location}
        >
          <Ionicons name="alert-circle" size={24} color="#fff" />
          <Text style={styles.reportButtonText}>Report ICE Activity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  statusCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  statusSubtext: {
    color: '#999',
    fontSize: 12,
  },
  enableButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    height: 300,
    marginBottom: 15,
  },
  map: {
    height: 300,
  },
  mapOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(42, 42, 42, 0.9)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  mapStatus: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  mapPlaceholder: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  mapPlaceholderText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  privacyCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  privacyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  privacyText: {
    color: '#ccc',
    fontSize: 14,
  },
  reportsCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    marginBottom: 100, // Space for fixed button
  },
  reportsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noReportsText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportText: {
    color: '#ccc',
    fontSize: 14,
  },
  reportTime: {
    color: '#999',
    fontSize: 12,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  reportButton: {
    backgroundColor: '#ff6b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 10,
  },
  reportButtonDisabled: {
    backgroundColor: '#666',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});