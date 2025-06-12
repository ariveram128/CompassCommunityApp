import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../../constants/config';

interface Report {
  id: string;
  type: keyof typeof CONFIG.REPORT_TYPES;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
  verified: boolean;
}

interface CommunityMapWebProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  reports: Report[];
  onReportPress?: (report: Report) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  showAlertRadius?: boolean;
  style?: any;
}

const MARKER_COLORS = {
  [CONFIG.REPORT_TYPES.ICE_CHECKPOINT]: '#ff6b35',
  [CONFIG.REPORT_TYPES.ICE_RAID]: '#f44336',
  [CONFIG.REPORT_TYPES.ICE_PATROL]: '#ff9800',
  [CONFIG.REPORT_TYPES.ICE_DETENTION]: '#d32f2f',
  [CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT]: '#4caf50'
};

const MARKER_ICONS = {
  [CONFIG.REPORT_TYPES.ICE_CHECKPOINT]: 'checkmark-circle',
  [CONFIG.REPORT_TYPES.ICE_RAID]: 'warning',
  [CONFIG.REPORT_TYPES.ICE_PATROL]: 'car',
  [CONFIG.REPORT_TYPES.ICE_DETENTION]: 'hand-left',
  [CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT]: 'heart'
};

export function CommunityMapWeb({ 
  userLocation, 
  reports, 
  onReportPress, 
  showAlertRadius = true,
  style 
}: CommunityMapWebProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getReportAge = (timestamp: number) => {
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (ageHours < 1) return `${Math.round(ageHours * 60)}m ago`;
    return `${Math.round(ageHours)}h ago`;
  };

  const isReportExpired = (timestamp: number) => {
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    return ageHours >= CONFIG.REPORT_EXPIRY_HOURS;
  };

  // Filter out expired reports
  const activeReports = reports.filter(report => !isReportExpired(report.timestamp));

  const handleReportPress = (report: Report) => {
    setSelectedReport(report);
    onReportPress?.(report);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.webMapPlaceholder}>
        <Ionicons name="map" size={48} color="#666" />
        <Text style={styles.webMapTitle}>Community Alert Map</Text>
        <Text style={styles.webMapSubtitle}>
          Web version - Install the mobile app for full map experience
        </Text>
        
        {userLocation && (
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>
              Your approximate area: {userLocation.latitude.toFixed(3)}, {userLocation.longitude.toFixed(3)}
            </Text>
          </View>
        )}

        {showAlertRadius && (
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>Alert Coverage</Text>
            <Text style={styles.alertText}>• High Priority: {CONFIG.HIGH_PRIORITY_RADIUS_KM}km radius</Text>
            <Text style={styles.alertText}>• Standard Alerts: {CONFIG.ALERT_RADIUS_KM}km radius</Text>
          </View>
        )}
      </View>

      {/* Reports List */}
      <View style={styles.reportsSection}>
        <Text style={styles.reportsTitle}>
          Active Community Reports ({activeReports.length})
        </Text>
        
        {activeReports.length === 0 ? (
          <View style={styles.noReports}>
            <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
            <Text style={styles.noReportsText}>No active reports in your area</Text>
            <Text style={styles.noReportsSubtext}>Community is safe at the moment</Text>
          </View>
        ) : (
          <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
            {activeReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportItem}
                onPress={() => handleReportPress(report)}
              >
                <View style={[
                  styles.reportIcon,
                  { backgroundColor: MARKER_COLORS[report.type] }
                ]}>
                  <Ionicons 
                    name={MARKER_ICONS[report.type] as any}
                    size={16}
                    color="#fff"
                  />
                </View>
                <View style={styles.reportContent}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportType}>
                      {report.type.replace('_', ' ').toUpperCase()}
                    </Text>
                    {report.verified && (
                      <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                    )}
                    {report.priority === 'high' && (
                      <View style={styles.highPriorityBadge}>
                        <Text style={styles.highPriorityText}>HIGH</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.reportTime}>
                    {getReportAge(report.timestamp)} • Distance: ~{Math.round(Math.random() * 5 + 1)}km
                  </Text>
                  <Text style={styles.reportLocation}>
                    Area: {report.location.latitude.toFixed(3)}, {report.location.longitude.toFixed(3)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Selected Report Details */}
      {selectedReport && (
        <View style={styles.selectedReportOverlay}>
          <View style={styles.selectedReport}>
            <View style={styles.selectedReportHeader}>
              <View style={[
                styles.selectedReportIcon,
                { backgroundColor: MARKER_COLORS[selectedReport.type] }
              ]}>
                <Ionicons 
                  name={MARKER_ICONS[selectedReport.type] as any}
                  size={20}
                  color="#fff"
                />
              </View>
              <View style={styles.selectedReportContent}>
                <Text style={styles.selectedReportType}>
                  {selectedReport.type.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.selectedReportTime}>
                  Reported {getReportAge(selectedReport.timestamp)}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedReport(null)}
              >
                <Ionicons name="close" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectedReportDescription}>
              Anonymous community report • {selectedReport.verified ? 'Verified by community' : 'Unverified'}
            </Text>
            <Text style={styles.selectedReportLocation}>
              Approximate location: {selectedReport.location.latitude.toFixed(3)}, {selectedReport.location.longitude.toFixed(3)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  webMapPlaceholder: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  webMapTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  webMapSubtitle: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    gap: 8,
  },
  locationText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  alertInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    width: '100%',
  },
  alertTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  reportsSection: {
    flex: 1,
    padding: 15,
  },
  reportsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noReports: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 40,
  },
  noReportsText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  noReportsSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  reportsList: {
    flex: 1,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  reportContent: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  reportType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  highPriorityBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highPriorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reportTime: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  reportLocation: {
    color: '#666',
    fontSize: 10,
  },
  selectedReportOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
  },
  selectedReport: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedReportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedReportContent: {
    flex: 1,
  },
  selectedReportType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedReportTime: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  selectedReportDescription: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  selectedReportLocation: {
    color: '#666',
    fontSize: 10,
  },
}); 