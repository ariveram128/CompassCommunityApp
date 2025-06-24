import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityMap } from '../src/components/Map';
import {
  AnimatedCard,
  COLORS,
  FeatureList,
  GlassCard,
  ModernButton,
  RADIUS,
  SPACING,
  StatusBadge,
  Typography
} from '../src/components/UI/DesignSystem';
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

  const getRecentReports = () => {
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') return [];
    
    return reports
      .filter(report => {
        if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') return false;
        const latDiff = Math.abs(report.location.latitude - location.latitude);
        const lonDiff = Math.abs(report.location.longitude - location.longitude);
        const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        return roughDistance < 0.1;
      })
      .slice(0, 3)
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

  const privacyFeatures = [
    { icon: 'shield-checkmark' as const, title: 'Anonymous reporting', description: 'No personal data collected' },
    { icon: 'time' as const, title: 'Auto-delete after 4 hours', description: 'Data automatically expires' },
    { icon: 'location' as const, title: 'Location anonymized', description: '~100m grid for privacy' },
    { icon: 'eye-off' as const, title: 'No tracking', description: 'Zero user identification' },
  ];

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.background, COLORS.surface]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDeveloperMenu} disabled={!__DEV__}>
              <Typography variant="h2">
                Compass Community
              </Typography>
            </TouchableOpacity>
            <Link href="/settings" asChild>
              <TouchableOpacity style={styles.settingsButton}>
                <View style={styles.settingsIcon}>
                  <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Hero Status Card */}
          <GlassCard style={styles.heroCard}>
            <View style={styles.statusHeader}>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: location ? COLORS.success : COLORS.error }
              ]}>
                <Ionicons 
                  name={location ? "shield-checkmark" : "shield-outline"} 
                  size={24} 
                  color={COLORS.textPrimary} 
                />
              </View>
              <View style={styles.statusContent}>
                <Typography variant="h3" color={COLORS.textPrimary}>
                  {location ? 'Protected' : 'Setup Required'}
                </Typography>
                <Typography variant="caption" color={COLORS.textSecondary}>
                  {loading ? 'Initializing location services...' : 
                   location ? 'Community safety monitoring active' : 
                   'Enable location to join the network'}
                </Typography>
              </View>
            </View>
            
            {location && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Typography variant="h3" color={COLORS.primary}>
                    {reports.length}
                  </Typography>
                  <Typography variant="small" color={COLORS.textMuted}>
                    Active Reports
                  </Typography>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Typography variant="h3" color={COLORS.secondary}>
                    {CONFIG.ALERT_RADIUS_KM}km
                  </Typography>
                  <Typography variant="small" color={COLORS.textMuted}>
                    Alert Radius
                  </Typography>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Typography variant="h3" color={COLORS.accent}>
                    4h
                  </Typography>
                  <Typography variant="small" color={COLORS.textMuted}>
                    Auto-Delete
                  </Typography>
                </View>
              </View>
            )}

            {!location && (
              <ModernButton
                title="Enable Location Services"
                onPress={refreshLocation}
                icon="location"
                variant="primary"
                style={styles.enableButton}
              />
            )}

            {error && (
              <View style={styles.errorContainer}>
                <StatusBadge status="error" text={`Error: ${error}`} icon="alert-circle" />
              </View>
            )}
          </GlassCard>

          {/* Community Map */}
          {showMap && location ? (
            <AnimatedCard style={styles.mapCard} noPadding>
              <View style={styles.mapHeader}>
                <Typography variant="h3" color={COLORS.textPrimary}>
                  Community Map
                </Typography>
                <StatusBadge 
                  status={reportsLoading ? "warning" : "active"} 
                  text={reportsLoading ? 'Loading...' : `${reports.length} reports`}
                />
              </View>
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
              </View>
            </AnimatedCard>
          ) : (
            <GlassCard style={styles.mapPlaceholder}>
              <View style={styles.placeholderContent}>
                <View style={styles.placeholderIcon}>
                  <Ionicons name="map-outline" size={48} color={COLORS.primary} />
                </View>
                <Typography variant="h3" color={COLORS.textPrimary} style={styles.placeholderTitle}>
                  {location ? 'Interactive Community Map' : 'Enable Location for Map'}
                </Typography>
                <Typography variant="caption" color={COLORS.textSecondary} style={styles.placeholderText}>
                  {location ? 'Map will load here with community alerts' : `Shows anonymized alerts within ${CONFIG.ALERT_RADIUS_KM}km radius`}
                </Typography>
              </View>
            </GlassCard>
          )}

          {/* Privacy Features */}
          <AnimatedCard style={styles.privacyCard}>
            <View style={styles.sectionHeader}>
              <Typography variant="h3" color={COLORS.textPrimary}>
                🔒 Privacy First Design
              </Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>
                Your safety and anonymity are our top priorities
              </Typography>
            </View>
            <FeatureList features={privacyFeatures} />
          </AnimatedCard>

          {/* Recent Reports */}
          {recentReports.length > 0 && (
            <AnimatedCard style={styles.reportsCard}>
              <View style={styles.sectionHeader}>
                <Typography variant="h3" color={COLORS.textPrimary}>
                  Recent Activity
                </Typography>
                <Typography variant="caption" color={COLORS.textSecondary}>
                  Community reports in your area
                </Typography>
              </View>
              <View style={styles.reportsList}>
                {recentReports.map((report, index) => (
                  <View key={index} style={styles.reportItem}>
                    <View style={styles.reportContent}>
                      <View style={[
                        styles.reportIcon,
                        { backgroundColor: report.priority === 'high' ? `${COLORS.error}20` : `${COLORS.warning}20` }
                      ]}>
                        <Ionicons 
                          name="alert-circle" 
                          size={16} 
                          color={report.priority === 'high' ? COLORS.error : COLORS.warning} 
                        />
                      </View>
                      <View style={styles.reportDetails}>
                        <Typography variant="caption" color={COLORS.textPrimary}>
                          {report.type}
                        </Typography>
                        <Typography variant="small" color={COLORS.textMuted}>
                          {report.timeAgo}
                        </Typography>
                      </View>
                    </View>
                    {report.verified && (
                      <StatusBadge status="active" text="Verified" icon="checkmark-circle" />
                    )}
                  </View>
                ))}
              </View>
            </AnimatedCard>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <Link href="/report" asChild>
            <TouchableOpacity 
              style={[styles.fab, !location && styles.fabDisabled]}
              disabled={!location}
            >
              <LinearGradient
                colors={location ? [COLORS.error, '#DC2626'] : [COLORS.textMuted, COLORS.textMuted]}
                style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.full }]}
              />
              <Ionicons name="alert-circle" size={28} color={COLORS.textPrimary} />
              <Typography variant="caption" color={COLORS.textPrimary} style={styles.fabText}>
                Report
              </Typography>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    background: 'transparent',
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Hero Card
  heroCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statusContent: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  enableButton: {
    marginTop: SPACING.md,
  },
  errorContainer: {
    marginTop: SPACING.md,
  },

  // Map Card
  mapCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: 0,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  mapContainer: {
    height: 280,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  map: {
    height: 280,
  },
  mapPlaceholder: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  placeholderTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    textAlign: 'center',
    maxWidth: 280,
  },

  // Privacy Card
  privacyCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.lg,
  },

  // Reports Card
  reportsCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  reportsList: {
    gap: SPACING.md,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  reportDetails: {
    flex: 1,
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  fabDisabled: {
    opacity: 0.5,
  },
  fabText: {
    marginTop: 2,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 120, // Space for FAB
  },
});