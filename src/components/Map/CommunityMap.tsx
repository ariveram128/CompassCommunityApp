import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { CONFIG } from '../../constants/config';

const { width, height } = Dimensions.get('window');

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

interface CommunityMapProps {
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

// Define marker colors for different report types using the type definitions
const MARKER_COLORS = {
  [CONFIG.REPORT_TYPES.ICE_CHECKPOINT]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_CHECKPOINT.color,
  [CONFIG.REPORT_TYPES.ICE_RAID]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_RAID.color,
  [CONFIG.REPORT_TYPES.ICE_PATROL]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_PATROL.color,
  [CONFIG.REPORT_TYPES.ICE_DETENTION]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_DETENTION.color,
  [CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT]: CONFIG.REPORT_TYPE_DEFINITIONS.COMMUNITY_SUPPORT.color
};

// Define marker icons for different report types using the type definitions
const MARKER_ICONS = {
  [CONFIG.REPORT_TYPES.ICE_CHECKPOINT]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_CHECKPOINT.icon,
  [CONFIG.REPORT_TYPES.ICE_RAID]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_RAID.icon,
  [CONFIG.REPORT_TYPES.ICE_PATROL]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_PATROL.icon,
  [CONFIG.REPORT_TYPES.ICE_DETENTION]: CONFIG.REPORT_TYPE_DEFINITIONS.ICE_DETENTION.icon,
  [CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT]: CONFIG.REPORT_TYPE_DEFINITIONS.COMMUNITY_SUPPORT.icon
};

export function CommunityMap({ 
  userLocation, 
  reports, 
  onReportPress, 
  onMapPress,
  showAlertRadius = true,
  style 
}: CommunityMapProps) {
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Dark map style for privacy-focused theme
  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#212121' }]
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#757575' }]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#212121' }]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#757575' }]
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9e9e9e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [{ color: '#2c2c2c' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8a8a8a' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#000000' }]
    }
  ];

  // Initialize map view when user location is available
  useEffect(() => {
    if (userLocation && mapReady && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05, // ~5km zoom level
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [userLocation, mapReady]);

  const handleMarkerPress = (report: Report) => {
    setSelectedReport(report);
    onReportPress?.(report);
  };

  const handleMapPress = (event: any) => {
    setSelectedReport(null);
    onMapPress?.(event.nativeEvent.coordinate);
  };

  const getMarkerSize = (report: Report) => {
    if (report.priority === 'high') return 30;
    if (report.priority === 'medium') return 25;
    return 20;
  };

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

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={mapStyle}
        showsUserLocation={false} // Privacy: don't show exact user location
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        onMapReady={() => setMapReady(true)}
        onPress={handleMapPress}
        initialRegion={userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        } : {
          // Default to central location if no user location
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* User Location Circle (anonymized, not exact) */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={200} // 200m circle - shows general area, not exact location
            strokeColor="rgba(76, 175, 80, 0.5)"
            fillColor="rgba(76, 175, 80, 0.1)"
            strokeWidth={2}
          />
        )}

        {/* Alert Radius */}
        {userLocation && showAlertRadius && (
          <>
            <Circle
              center={userLocation}
              radius={CONFIG.ALERT_RADIUS_KM * 1000}
              strokeColor="rgba(255, 107, 53, 0.3)"
              fillColor="rgba(255, 107, 53, 0.05)"
              strokeWidth={1}
              lineDashPattern={[10, 10]}
            />
            <Circle
              center={userLocation}
              radius={CONFIG.HIGH_PRIORITY_RADIUS_KM * 1000}
              strokeColor="rgba(244, 67, 54, 0.4)"
              fillColor="rgba(244, 67, 54, 0.08)"
              strokeWidth={2}
              lineDashPattern={[5, 5]}
            />
          </>
        )}

        {/* Community Reports */}
        {activeReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={report.location}
            onPress={() => handleMarkerPress(report)}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[
              styles.markerContainer,
              { 
                backgroundColor: MARKER_COLORS[report.type],
                width: getMarkerSize(report),
                height: getMarkerSize(report),
                opacity: report.verified ? 1 : 0.7
              }
            ]}>
              <Ionicons 
                name={MARKER_ICONS[report.type] as any}
                size={getMarkerSize(report) * 0.6}
                color="#fff"
              />
              {report.priority === 'high' && (
                <View style={styles.priorityIndicator} />
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Selected Report Info */}
      {selectedReport && (
        <View style={styles.reportInfoContainer}>
          <View style={styles.reportInfo}>
            <View style={styles.reportHeader}>
              <View style={[
                styles.reportTypeIcon,
                { backgroundColor: MARKER_COLORS[selectedReport.type] }
              ]}>
                <Ionicons 
                  name={MARKER_ICONS[selectedReport.type] as any}
                  size={16}
                  color="#fff"
                />
              </View>
              <View style={styles.reportDetails}>
                <Text style={styles.reportType}>
                  {selectedReport.type.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.reportTime}>
                  {getReportAge(selectedReport.timestamp)}
                  {selectedReport.verified && (
                    <Text style={styles.verifiedText}> • Verified</Text>
                  )}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedReport(null)}
              >
                <Ionicons name="close" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
            <Text style={styles.reportDescription}>
              Community report within your alert area
            </Text>
          </View>
        </View>
      )}

      {/* Map Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Alert Zones</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendCircle, { backgroundColor: 'rgba(244, 67, 54, 0.3)' }]} />
          <Text style={styles.legendText}>High Priority ({CONFIG.HIGH_PRIORITY_RADIUS_KM}km)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendCircle, { backgroundColor: 'rgba(255, 107, 53, 0.3)' }]} />
          <Text style={styles.legendText}>Standard Alerts ({CONFIG.ALERT_RADIUS_KM}km)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  priorityIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
    borderWidth: 1,
    borderColor: '#fff',
  },
  reportInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  reportInfo: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportDetails: {
    flex: 1,
  },
  reportType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportTime: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  verifiedText: {
    color: '#4caf50',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  reportDescription: {
    color: '#999',
    fontSize: 12,
  },
  legend: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'rgba(42, 42, 42, 0.9)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  legendTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  legendText: {
    color: '#ccc',
    fontSize: 10,
  },
}); 