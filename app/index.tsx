import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CONFIG } from '../src/constants/config';
import { useLocation } from '../src/hooks/useLocation';

export default function HomeScreen() {
  const { location, loading, error, refreshLocation } = useLocation();
  const [reports, setReports] = useState([]);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ICE Community Alert</Text>
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
                Anonymized to protect your privacy
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

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color="#666" />
          <Text style={styles.mapPlaceholderText}>
            Interactive map will load here
          </Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Shows anonymized community alerts within {CONFIG.ALERT_RADIUS_KM}km
          </Text>
        </View>

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
          {reports.length === 0 ? (
            <Text style={styles.noReportsText}>
              No recent reports in your area
            </Text>
          ) : (
            reports.map((report, index) => (
              <View key={index} style={styles.reportItem}>
                <Text style={styles.reportText}>{report.type}</Text>
                <Text style={styles.reportTime}>{report.timeAgo}</Text>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
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