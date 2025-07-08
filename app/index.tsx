import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityMap } from '../src/components/Map';
import { OnboardingModal } from '../src/components/Onboarding/OnboardingModal';
import { CONFIG } from '../src/constants/config';
import { useCustomAlert } from '../src/hooks/useCustomAlert';
import { useLocation } from '../src/hooks/useLocation';
import { useReports } from '../src/hooks/useReports';
import { useVerification } from '../src/hooks/useVerification';
import { ErrorService } from '../src/services/Error/ErrorService';
import { NotificationService } from '../src/services/Notification/NotificationService';
import { OnboardingService } from '../src/services/Onboarding/OnboardingService';
import type { CommunityReport } from '../src/services/Report/ReportService';
import { ReportService } from '../src/services/Report/ReportService';
import { DevUtils } from '../src/utils/DevUtils';

type AlertActionStyle = 'default' | 'destructive' | 'cancel' | 'primary';

export default function HomeScreen() {
  const { reports, loading, error, refreshReports, generateSampleData, clearAllData } = useReports();
  const { location, permissions, requestPermissions, refreshLocation } = useLocation();
  const { verificationStats, getTrustLevelInfo, clearAllData: clearVerificationData } = useVerification();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [showMap, setShowMap] = useState(true);
  const [servicesInitialized, setServicesInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Add ref to track last location to prevent infinite updates
  const lastLocationRef = useRef<{latitude: number; longitude: number} | null>(null);

  // Initialize services and check onboarding
  useEffect(() => {
    const initializeServices = async () => {
      try {
        DevUtils.log('Starting service initialization...');
        await ErrorService.initialize();
        await OnboardingService.initialize();
        await NotificationService.initialize();
        await ReportService.initialize();
        setServicesInitialized(true);
        DevUtils.log('App services initialized');

        // Check if we should show onboarding
        const shouldShow = await OnboardingService.shouldShowOnboarding();
        if (shouldShow) {
          DevUtils.log('Showing onboarding to new user');
          setShowOnboarding(true);
        }
      } catch (error) {
        DevUtils.error('Failed to initialize services:', error);
        setServicesInitialized(true); // Still allow app to work
      }
    };

    initializeServices();
  }, []);

  // Update location for notification service when user location changes
  useEffect(() => {
    if (location && servicesInitialized) {
      const currentLocation = { 
        latitude: (location as any).latitude, 
        longitude: (location as any).longitude 
      };
      
      // Only update if location has changed significantly (>50m to prevent minor GPS drift updates)
      const lastLocation = lastLocationRef.current;
      if (!lastLocation || 
          Math.abs(currentLocation.latitude - lastLocation.latitude) > 0.0005 ||
          Math.abs(currentLocation.longitude - lastLocation.longitude) > 0.0005) {
        
        lastLocationRef.current = currentLocation;
        ReportService.setUserLocation(currentLocation);
        DevUtils.log('User location updated for notifications');
      }
    }
  }, [location, servicesInitialized]);

  const handleDeveloperMenu = () => {
    if (!DevUtils.showDeveloperMenu) return;
    
    showAlert(
      'Developer Tools',
      'Choose an action for testing:',
      [
        { text: 'Cancel', style: 'cancel' as AlertActionStyle },
        { 
          text: 'Generate Sample Reports', 
          style: 'default' as AlertActionStyle,
          onPress: () => location && generateSampleData(location)
        },
        {
          text: 'Generate Sample Verifications',
          style: 'default' as AlertActionStyle,
          onPress: () => location && generateSampleVerifications()
        },
        { 
          text: 'Clear Report Data', 
          style: 'destructive' as AlertActionStyle,
          onPress: clearAllData
        },
        {
          text: 'Clear Verification Data',
          style: 'destructive' as AlertActionStyle, 
          onPress: () => clearVerificationData()
        },
        { 
          text: 'Toggle Map', 
          style: 'default' as AlertActionStyle,
          onPress: () => setShowMap(!showMap)
        },
        {
          text: 'Test Notification',
          style: 'default' as AlertActionStyle,
          onPress: () => testNotification()
        },
        {
          text: 'Show Verification Stats',
          style: 'default' as AlertActionStyle,
          onPress: () => showVerificationStats()
        },
        {
          text: 'Show Onboarding',
          style: 'primary' as AlertActionStyle,
          onPress: () => setShowOnboarding(true)
        },
        {
          text: 'Reset Onboarding',
          style: 'destructive' as AlertActionStyle,
          onPress: () => resetOnboarding()
        }
      ],
      { icon: 'code-slash', iconColor: '#6366F1' }
    );
  };

  const resetOnboarding = async () => {
    try {
      await OnboardingService.resetOnboarding();
      showAlert(
        'Onboarding Reset',
        'Onboarding has been reset. The app will show onboarding on next launch.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'refresh', iconColor: '#10B981' }
      );
      DevUtils.log('Onboarding reset by developer');
    } catch (error) {
      DevUtils.error('Failed to reset onboarding:', error);
      showAlert(
        'Error',
        'Failed to reset onboarding.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'alert-circle', iconColor: '#EF4444' }
      );
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    DevUtils.log('User completed onboarding');
    
    // Show welcome message
    showAlert(
      'Welcome to Compass Community!',
      'You\'re all set to start using the app. Explore the map, submit reports, and help keep your community safe.',
      [{ text: 'Let\'s Go!', style: 'primary' as AlertActionStyle }],
      { icon: 'checkmark-circle', iconColor: '#10B981' }
    );
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    DevUtils.log('User skipped onboarding');
  };

  const generateSampleVerifications = async () => {
    if (!DevUtils.enableSampleData) return;
    
    if (!location) {
      showAlert(
        'Location Required',
        'Enable location to generate sample verifications.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'location-outline', iconColor: '#EF4444' }
      );
      return;
    }

    try {
      const userLocation = location as { latitude: number; longitude: number };
      
      // Generate some sample reports first if none exist
      if (reports.length === 0) {
        await generateSampleData(userLocation);
        // Wait a bit for reports to be generated
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Get updated reports
      const activeReports = await ReportService.getActiveReports();
      
      if (activeReports.length === 0) {
        showAlert(
          'No Reports',
          'Generate sample reports first.',
          [{ text: 'OK', style: 'primary' as AlertActionStyle }],
          { icon: 'document-outline', iconColor: '#F59E0B' }
        );
        return;
      }

      // Simulate community verifications for existing reports
      const { VerificationService } = await import('../src/services/Verification/VerificationService');
      
      for (let i = 0; i < Math.min(3, activeReports.length); i++) {
        const report = activeReports[i];
        
        // Simulate 1-3 verifications per report from different users
        const verificationCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < verificationCount; j++) {
          // Create slight location variations to simulate different users
          const verifierLocation = {
            latitude: userLocation.latitude + (Math.random() - 0.5) * 0.01,
            longitude: userLocation.longitude + (Math.random() - 0.5) * 0.01
          };
          
          try {
            await VerificationService.verifyReport(
              report.id,
              report.location,
              report.timestamp,
              verifierLocation
            );
          } catch (error) {
            DevUtils.log('Simulation verification already exists or failed:', error);
          }
        }
      }

      showAlert(
        'Sample Verifications Generated',
        'Created sample verifications for testing. Check the Recent Activity screen to see verification indicators!',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'checkmark-circle', iconColor: '#10B981' }
      );
      
      // Refresh reports to show updated verification status
      await refreshReports();
      
    } catch (error) {
      DevUtils.error('Error generating sample verifications:', error);
      showAlert(
        'Error',
        'Failed to generate sample verifications.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'alert-circle', iconColor: '#EF4444' }
      );
    }
  };

  const showVerificationStats = () => {
    if (!DevUtils.showDeveloperMenu) return;
    
    const trustInfo = getTrustLevelInfo(verificationStats.trustLevel);
    const message = 
      `Trust Level: ${trustInfo.label}\n` +
      `Trust Score: ${(verificationStats.userTrustScore * 100).toFixed(1)}%\n` +
      `Verifications Submitted: ${verificationStats.verificationsSubmitted}\n` +
      `Total Community Verifications: ${verificationStats.totalVerifications}\n\n` +
      `${trustInfo.description}`;
    
    showAlert(
      'Verification Statistics',
      message,
      [{ text: 'OK', style: 'primary' as AlertActionStyle }],
      { icon: trustInfo.icon, iconColor: trustInfo.color }
    );
  };

  const testNotification = async () => {
    if (!DevUtils.showDeveloperMenu) return;
    
    if (!location) {
      showAlert(
        'Location Required',
        'Enable location to test notifications.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'location-outline', iconColor: '#EF4444' }
      );
      return;
    }

    // Create a test report near user location
    const userLocation = location as { latitude: number; longitude: number };
    const testReport = {
      id: 'test-' + Date.now(),
      type: 'ICE_CHECKPOINT' as keyof typeof CONFIG.REPORT_TYPES,
      location: {
        latitude: userLocation.latitude + 0.001, // ~100m away
        longitude: userLocation.longitude + 0.001
      },
      timestamp: Date.now(),
      priority: 'high' as 'low' | 'medium' | 'high',
      verified: false,
      deviceHash: 'test-device',
      expiresAt: Date.now() + (4 * 60 * 60 * 1000)
    };

    await NotificationService.checkForNearbyReports(testReport);
    showAlert(
      'Test Notification',
      'Check if you received a test notification!',
      [{ text: 'OK', style: 'primary' as AlertActionStyle }],
      { icon: 'notifications', iconColor: '#6366F1' }
    );
  };

  const getTimeAgo = (timestamp: number) => {
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (ageHours < 1) return `${Math.round(ageHours * 60)}m ago`;
    return `${Math.round(ageHours)}h ago`;
  };

  const handleReportPress = (report: CommunityReport) => {
    const message = `${report.type.replace('_', ' ').toUpperCase()}\n\nReported ${getTimeAgo(report.timestamp)}\n${report.verified ? 'Verified by community' : 'Unverified report'}`;
    
    showAlert(
      'Community Report',
      message,
      [{ text: 'OK', style: 'primary' as AlertActionStyle }],
      { icon: 'document-text', iconColor: '#6366F1' }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          {DevUtils.showDeveloperMenu ? (
            <TouchableOpacity onPress={handleDeveloperMenu}>
              <Text style={styles.title}>Compass Community</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.title}>Compass Community</Text>
          )}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/activity' as any)}>
              <Ionicons name="list-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </TouchableOpacity>
            {DevUtils.showDeveloperMenu && (
              <TouchableOpacity style={[styles.headerButton, styles.devButton]} onPress={handleDeveloperMenu}>
                <Ionicons name="code-slash" size={20} color="#6366F1" />
          </TouchableOpacity>
            )}
          </View>
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
                {servicesInitialized && ' • Push notifications enabled'}
              </Text>
              {servicesInitialized && verificationStats && (
                <View style={styles.verificationStatus}>
                  <View style={styles.verificationItem}>
                    <Ionicons name={getTrustLevelInfo(verificationStats.trustLevel).icon} size={14} color={getTrustLevelInfo(verificationStats.trustLevel).color} />
                    <Text style={[styles.verificationText, { color: getTrustLevelInfo(verificationStats.trustLevel).color }]}>
                      {getTrustLevelInfo(verificationStats.trustLevel).label}
                    </Text>
                  </View>
                  <Text style={styles.verificationSubtext}>
                    {verificationStats.verificationsSubmitted} verifications submitted
                  </Text>
                </View>
              )}
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
                onReportPress={handleReportPress}
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
          {servicesInitialized && (
            <View style={styles.privacyFeature}>
              <Ionicons name="notifications" size={16} color="#10B981" />
              <Text style={styles.privacyText}>Smart location-based alerts</Text>
              </View>
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
          disabled={!location}
          onPress={() => location && router.push('/report')}
        >
          <Ionicons name="alert-circle" size={24} color="#fff" />
          <Text style={styles.reportButtonText}>Report Activity</Text>
        </TouchableOpacity>
      </View>
      
      <AlertComponent />
      <OnboardingModal
        visible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  devButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  verificationText: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  verificationSubtext: {
    color: '#94A3B8',
    fontSize: 12,
  },
});