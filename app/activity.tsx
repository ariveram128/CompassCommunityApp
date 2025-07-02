import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONFIG } from '../src/constants/config';
import { useLocation } from '../src/hooks/useLocation';
import { useReports } from '../src/hooks/useReports';
import { useVerification } from '../src/hooks/useVerification';
import { LocationService } from '../src/services/Location/LocationService';
import type { CommunityReport } from '../src/services/Report/ReportService';

type FilterType = 'all' | keyof typeof CONFIG.REPORT_TYPES;
type SortType = 'newest' | 'oldest' | 'closest' | 'priority' | 'verified';
type TimeFilter = 'all' | '1h' | '2h' | '4h';

const REPORT_TYPE_LABELS: Record<keyof typeof CONFIG.REPORT_TYPES, string> = {
  'ICE_CHECKPOINT': 'Checkpoint',
  'ICE_RAID': 'Raid Activity',
  'ICE_PATROL': 'Patrol Activity',
  'ICE_DETENTION': 'Detention Activity',
  'COMMUNITY_SUPPORT': 'Community Support'
};

const PRIORITY_COLORS = {
  'high': '#EF4444',
  'medium': '#F59E0B',
  'low': '#10B981'
};

const PRIORITY_ICONS = {
  'high': 'alert-circle' as const,
  'medium': 'warning' as const,
  'low': 'information-circle' as const
};

export default function RecentActivityScreen() {
  const { location } = useLocation();
  const { reports, loading: reportsLoading, refreshReports } = useReports();
  const { 
    verificationStats, 
    canVerifyReport, 
    verifyReport,
    getVerificationStrengthInfo,
    getTrustLevelInfo,
    loading: verificationLoading
  } = useVerification();
  
  const [filteredReports, setFilteredReports] = useState<CommunityReport[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(10); // km

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reports];

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = Date.now();
      const timeLimit = {
        '1h': 1 * 60 * 60 * 1000,
        '2h': 2 * 60 * 60 * 1000,
        '4h': 4 * 60 * 60 * 1000
      }[timeFilter];
      
      if (timeLimit) {
        filtered = filtered.filter(report => now - report.timestamp <= timeLimit);
      }
    }

    // Apply distance filter
    if (location) {
      filtered = filtered.filter(report => {
        const distance = LocationService.calculateDistance(location, report.location);
        return distance <= distanceFilter;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'verified':
          const verificationOrder = { 'verified': 5, 'strong': 4, 'medium': 3, 'weak': 2, 'unverified': 1 };
          const aStrength = a.verificationSummary?.verificationStrength || 'unverified';
          const bStrength = b.verificationSummary?.verificationStrength || 'unverified';
          return verificationOrder[bStrength] - verificationOrder[aStrength];
        case 'closest':
          if (!location) return 0;
          const distanceA = LocationService.calculateDistance(location, a.location);
          const distanceB = LocationService.calculateDistance(location, b.location);
          return distanceA - distanceB;
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  }, [reports, typeFilter, sortBy, timeFilter, distanceFilter, location]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshReports();
    } catch (error) {
      console.error('Error refreshing reports:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshReports]);

  const getTimeAgo = (timestamp: number) => {
    const ageMinutes = (Date.now() - timestamp) / (1000 * 60);
    if (ageMinutes < 60) return `${Math.round(ageMinutes)}m ago`;
    const ageHours = ageMinutes / 60;
    if (ageHours < 24) return `${Math.round(ageHours)}h ago`;
    return `${Math.round(ageHours / 24)}d ago`;
  };

  const getDistance = (report: CommunityReport) => {
    if (!location) return null;
    const distance = LocationService.calculateDistance(location, report.location);
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const handleVerifyReport = async (report: CommunityReport) => {
    if (!location) {
      Alert.alert('Location Required', 'Enable location to verify reports.');
      return;
    }

    try {
      // Check if user can verify this report
      const eligibility = await canVerifyReport(report.id, report.location);
      
      if (!eligibility.allowed) {
        Alert.alert('Cannot Verify', eligibility.reason || 'Unable to verify this report');
        return;
      }

      // Confirm verification
      Alert.alert(
        'Verify Report',
        `Confirm this ${REPORT_TYPE_LABELS[report.type]} report?\n\nThis helps the community assess report reliability.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Verify', 
            onPress: async () => {
              const result = await verifyReport(report.id, report.location, report.timestamp);
              
              if (result.success) {
                Alert.alert('Verification Submitted', 'Thank you for helping verify this report!');
                // Refresh reports to update verification status
                await refreshReports();
              } else {
                Alert.alert('Verification Failed', result.error || 'Unable to submit verification');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error handling verification:', error);
      Alert.alert('Error', 'Unable to verify report at this time');
    }
  };

  const handleReportPress = (report: CommunityReport) => {
    const distance = getDistance(report);
    const verificationInfo = getVerificationStrengthInfo(
      report.verificationSummary?.verificationStrength || 'unverified'
    );
    
    Alert.alert(
      `${REPORT_TYPE_LABELS[report.type]}`,
      `Priority: ${report.priority.toUpperCase()}\n` +
      `Reported: ${getTimeAgo(report.timestamp)}\n` +
      `Distance: ${distance || 'Unknown'}\n` +
      `Verification: ${verificationInfo.label}\n` +
      `Community Verifications: ${report.verificationSummary?.totalVerifications || 0}\n` +
      `ID: ${report.id}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'View on Map', onPress: () => viewOnMap(report) },
        location ? { text: 'Verify Report', onPress: () => handleVerifyReport(report) } : null
      ].filter(Boolean) as any
    );
  };

  const viewOnMap = (report: CommunityReport) => {
    // Navigate back to home with selected report
    router.push(`/?reportId=${report.id}`);
  };

  const renderVerificationBadge = (report: CommunityReport) => {
    const verificationSummary = report.verificationSummary;
    if (!verificationSummary || verificationSummary.totalVerifications === 0) {
      return null;
    }

    const verificationInfo = getVerificationStrengthInfo(verificationSummary.verificationStrength);
    
    return (
      <View style={[styles.verificationBadge, { backgroundColor: verificationInfo.color + '20' }]}>
        <Ionicons name={verificationInfo.icon} size={12} color={verificationInfo.color} />
        <Text style={[styles.verificationText, { color: verificationInfo.color }]}>
          {verificationSummary.totalVerifications}
        </Text>
      </View>
    );
  };

  const renderReportItem = ({ item: report }: { item: CommunityReport }) => {
    const distance = getDistance(report);
    const priorityColor = PRIORITY_COLORS[report.priority];
    const verificationInfo = getVerificationStrengthInfo(
      report.verificationSummary?.verificationStrength || 'unverified'
    );
    
    return (
      <TouchableOpacity 
        style={styles.reportItem} 
        onPress={() => handleReportPress(report)}
        activeOpacity={0.7}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportTitle}>
            <Ionicons 
              name={PRIORITY_ICONS[report.priority]} 
              size={20} 
              color={priorityColor} 
            />
            <Text style={styles.reportType}>{REPORT_TYPE_LABELS[report.type]}</Text>
            {renderVerificationBadge(report)}
          </View>
          <Text style={[styles.priority, { color: priorityColor }]}>
            {report.priority.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.reportDetails}>
          <View style={styles.reportMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color="#94A3B8" />
              <Text style={styles.metaText}>{getTimeAgo(report.timestamp)}</Text>
            </View>
            {distance && (
              <View style={styles.metaItem}>
                <Ionicons name="location" size={14} color="#94A3B8" />
                <Text style={styles.metaText}>{distance}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Ionicons name={verificationInfo.icon} size={14} color={verificationInfo.color} />
              <Text style={[styles.metaText, { color: verificationInfo.color }]}>
                {verificationInfo.label}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => viewOnMap(report)}
            >
              <Ionicons name="map" size={16} color="#6366F1" />
            </TouchableOpacity>
            {location && (
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={() => handleVerifyReport(report)}
              >
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={64} color="#64748B" />
      <Text style={styles.emptyTitle}>No Recent Activity</Text>
      <Text style={styles.emptySubtitle}>
        {typeFilter !== 'all' 
          ? `No ${REPORT_TYPE_LABELS[typeFilter]} reports match your filters`
          : 'No recent reports in your area'
        }
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onRefresh}>
        <Text style={styles.emptyButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Reports</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Report Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Report Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[styles.filterChip, typeFilter === 'all' && styles.filterChipActive]}
                onPress={() => setTypeFilter('all')}
              >
                <Text style={[styles.filterChipText, typeFilter === 'all' && styles.filterChipTextActive]}>
                  All Types
                </Text>
              </TouchableOpacity>
              {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                <TouchableOpacity 
                  key={key}
                  style={[styles.filterChip, typeFilter === key && styles.filterChipActive]}
                  onPress={() => setTypeFilter(key as FilterType)}
                >
                  <Text style={[styles.filterChipText, typeFilter === key && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Time Range</Text>
            <View style={styles.filterOptions}>
              {[
                ['all', 'All Time'],
                ['1h', 'Last Hour'],
                ['2h', 'Last 2 Hours'],
                ['4h', 'Last 4 Hours']
              ].map(([key, label]) => (
                <TouchableOpacity 
                  key={key}
                  style={[styles.filterChip, timeFilter === key && styles.filterChipActive]}
                  onPress={() => setTimeFilter(key as TimeFilter)}
                >
                  <Text style={[styles.filterChipText, timeFilter === key && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {[
                ['newest', 'Newest First'],
                ['oldest', 'Oldest First'],
                ['closest', 'Closest First'],
                ['priority', 'Priority'],
                ['verified', 'Most Verified']
              ].map(([key, label]) => (
                <TouchableOpacity 
                  key={key}
                  style={[styles.filterChip, sortBy === key && styles.filterChipActive]}
                  onPress={() => setSortBy(key as SortType)}
                >
                  <Text style={[styles.filterChipText, sortBy === key && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Maximum Distance</Text>
            <View style={styles.filterOptions}>
              {[2, 5, 10, 20, 50].map((distance) => (
                <TouchableOpacity 
                  key={distance}
                  style={[styles.filterChip, distanceFilter === distance && styles.filterChipActive]}
                  onPress={() => setDistanceFilter(distance)}
                >
                  <Text style={[styles.filterChipText, distanceFilter === distance && styles.filterChipTextActive]}>
                    {distance}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const trustLevelInfo = getTrustLevelInfo(verificationStats.trustLevel);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statsLeft}>
          <Text style={styles.statsText}>
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </Text>
          {typeFilter !== 'all' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{REPORT_TYPE_LABELS[typeFilter]}</Text>
              <TouchableOpacity onPress={() => setTypeFilter('all')}>
                <Ionicons name="close" size={16} color="#6366F1" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Trust Level Indicator */}
        <View style={[styles.trustBadge, { backgroundColor: trustLevelInfo.color + '20' }]}>
          <Ionicons name={trustLevelInfo.icon} size={14} color={trustLevelInfo.color} />
          <Text style={[styles.trustText, { color: trustLevelInfo.color }]}>
            {trustLevelInfo.label}
          </Text>
        </View>
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
            colors={['#6366F1']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {renderFilterModal()}
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
  filterButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statsText: {
    color: '#94A3B8',
    fontSize: 14,
    marginRight: 12,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '500',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  reportItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reportType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priority: {
    fontSize: 12,
    fontWeight: '700',
  },
  reportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  verifyButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  filterSection: {
    marginVertical: 24,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterChipText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
}); 