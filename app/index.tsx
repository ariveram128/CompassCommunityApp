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
import { useTranslation } from '../src/hooks/useTranslation';
import { useVerification } from '../src/hooks/useVerification';
import { ErrorService } from '../src/services/Error/ErrorService';
import { NotificationService } from '../src/services/Notification/NotificationService';
import { OnboardingService } from '../src/services/Onboarding/OnboardingService';
import type { CommunityReport } from '../src/services/Report/ReportService';
import { ReportService } from '../src/services/Report/ReportService';
import { DevUtils } from '../src/utils/DevUtils';

type AlertActionStyle = 'default' | 'destructive' | 'cancel' | 'primary';

export default function HomeScreen() {
  const { t, currentLanguage } = useTranslation(); // Add translation hook with currentLanguage for re-renders
  const { location, loading, error, refreshLocation } = useLocation();
  const { reports, loading: reportsLoading, refreshReports, generateSampleData } = useReports();
  const { 
    verificationStats, 
    canVerifyReport, 
    verifyReport,
    getVerificationStrengthInfo,
    getTrustLevelInfo,
    loading: verificationLoading
  } = useVerification();
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [servicesInitialized, setServicesInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const mapRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(true);

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
      'Developer Menu',
      'Development tools and testing utilities',
      [
        { text: 'Cancel', style: 'cancel' as AlertActionStyle },
        { 
          text: 'Generate Sample Data', 
          style: 'default' as AlertActionStyle,
          onPress: () => location && generateSampleVerifications()
        },
        { 
          text: 'Clear Report Data', 
          style: 'destructive' as AlertActionStyle,
          onPress: async () => {
            const { ReportService } = await import('../src/services/Report/ReportService');
            await ReportService.clearAllData();
            await refreshReports();
          }
        },
        {
          text: 'Clear Verification Data',
          style: 'destructive' as AlertActionStyle, 
          onPress: async () => {
            const { VerificationService } = await import('../src/services/Verification/VerificationService');
            await VerificationService.clearAllData();
          }
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
          text: 'Reset Language',
          style: 'default' as AlertActionStyle,
          onPress: () => resetLanguageToDevice()
        },
        {
          text: 'Show Onboarding Now',
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

  const resetLanguageToDevice = async () => {
    try {
      const { storeLanguage, getDeviceLanguage, changeLanguage } = await import('../src/services/i18n/i18n');
      const deviceLanguage = getDeviceLanguage();
      await storeLanguage(deviceLanguage);
      await changeLanguage(deviceLanguage);
      
      showAlert(
        'Language Reset',
        `Language reset to device setting: ${deviceLanguage === 'es' ? 'Español' : 'English'}`,
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'language', iconColor: '#6366F1' }
      );
      DevUtils.log('Language reset to device setting:', deviceLanguage);
    } catch (error) {
      DevUtils.error('Failed to reset language:', error);
      showAlert(
        'Error',
        'Failed to reset language.',
        [{ text: 'OK', style: 'primary' as AlertActionStyle }],
        { icon: 'alert-circle', iconColor: '#EF4444' }
      );
    }
  };

  const resetOnboarding = async () => {
    try {
      await OnboardingService.resetOnboarding();
      
      // Also clear language preference to re-detect device language
      const { storeLanguage, getDeviceLanguage, changeLanguage } = await import('../src/services/i18n/i18n');
      const deviceLanguage = getDeviceLanguage();
      await storeLanguage(deviceLanguage);
      
      // Change to detected language immediately
      await changeLanguage(deviceLanguage);
      
      // Immediately show onboarding after reset
      setShowOnboarding(true);
      showAlert(
        'Onboarding Reset',
        'Onboarding has been reset and will show now.',
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
      t('onboarding.complete.welcomeTitle'),
      t('onboarding.complete.welcomeMessage'),
      [{ text: t('onboarding.complete.welcomeAction'), style: 'primary' as AlertActionStyle }],
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
              {location ? t('home.status.protected') : t('home.status.setupRequired')}
            </Text>
          </View>
          
          {loading ? (
            <Text style={styles.statusText}>{t('home.status.initializing')}</Text>
          ) : location ? (
            <View>
              <Text style={[styles.statusText, { color: "#10B981" }]}>
                {t('home.status.active')}
              </Text>
              <Text style={styles.statusSubtext}>
                {t('home.status.anonymized')} • {t('home.status.activeReports', { count: reports.length })}
                {servicesInitialized && t('home.status.pushEnabled')}
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
                    {t('home.verification.submitted', { count: verificationStats.verificationsSubmitted })}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={[styles.statusText, { color: "#EF4444" }]}>
                {t('home.status.enable')}
              </Text>
              <TouchableOpacity 
                style={styles.enableButton}
                onPress={refreshLocation}
              >
                <Text style={styles.enableButtonText}>{t('home.status.enableButton')}</Text>
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
            <Text style={styles.sectionTitle}>{t('home.map.title')}</Text>
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
              {location ? t('home.map.title') : t('home.map.loading')}
          </Text>
          <Text style={styles.mapPlaceholderSubtext}>
              {t('home.map.subtitle')}
          </Text>
        </View>
        )}

        {/* Emergency Actions */}
        <View style={styles.emergencyCard}>
          <Text style={styles.sectionTitle}>🚨 {t('home.emergency.title')}</Text>
          <Text style={styles.emergencyDescription}>
            {t('home.emergency.description')}
          </Text>
          
          {/* Panic Button - Coming Soon */}
          <TouchableOpacity 
            style={styles.panicButtonPlaceholder}
            disabled={true}
          >
            <View style={styles.panicButtonContent}>
              <Ionicons name="warning" size={32} color="#94A3B8" />
              <View style={styles.panicButtonTextContainer}>
                <Text style={styles.panicButtonTitle}>
                  {t('home.emergency.panicButton.title')}
                </Text>
                <Text style={styles.panicButtonSubtitle}>
                  {t('home.emergency.panicButton.comingSoon')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.emergencyNote}>
            <Ionicons name="information-circle" size={16} color="#6366F1" />
            <Text style={styles.emergencyNoteText}>
              {t('home.emergency.note')}
            </Text>
          </View>
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
          <Text style={styles.reportButtonText}>{t('home.quickActions.report')}</Text>
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
  emergencyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emergencyDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  panicButtonPlaceholder: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    opacity: 0.6,
  },
  panicButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  panicButtonTextContainer: {
    flex: 1,
  },
  panicButtonTitle: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  panicButtonSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  emergencyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  emergencyNoteText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
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