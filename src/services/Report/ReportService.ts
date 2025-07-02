import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../constants/config.js';
import { LocationService } from '../Location/LocationService.js';
import { NotificationService } from '../Notification/NotificationService.js';
// @ts-ignore - crypto-js doesn't have types but is commonly used
import CryptoJS from 'crypto-js';

export interface CommunityReport {
  id: string;
  type: keyof typeof CONFIG.REPORT_TYPES;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
  verified: boolean;
  deviceHash: string; // Anonymous device identifier for rate limiting
  expiresAt: number;
}

export interface ReportSubmission {
  type: keyof typeof CONFIG.REPORT_TYPES;
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  urgency: 'low' | 'medium' | 'high';
}

const STORAGE_KEYS = {
  REPORTS: '@community_reports',
  USER_REPORTS: '@user_reports',
  LAST_REPORT_TIME: '@last_report_time',
  DAILY_REPORT_COUNT: '@daily_report_count',
  DEVICE_ID: '@device_id'
};

export class ReportService {
  private static deviceId: string | null = null;

  /**
   * Initialize the report service
   */
  static async initialize(): Promise<void> {
    try {
      // Initialize notification service
      await NotificationService.initialize();
      console.log('Report service initialized');
    } catch (error) {
      console.error('Failed to initialize report service:', error);
    }
  }

  /**
   * Set user location for notification service
   */
  static setUserLocation(location: { latitude: number; longitude: number }): void {
    NotificationService.setUserLocation(location);
  }

  /**
   * Get or generate anonymous device identifier for rate limiting
   */
  private static async getDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      
      if (!deviceId) {
        // Generate anonymous device hash
        const timestamp = Date.now().toString();
        const random = Math.random().toString();
        const newDeviceId = CryptoJS.SHA256(timestamp + random).toString();
        await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, newDeviceId);
        this.deviceId = newDeviceId;
        return newDeviceId;
      }

      this.deviceId = deviceId;
      return deviceId;
    } catch (error) {
      console.error('Failed to get device ID:', error);
      // Fallback to session-only ID
      const fallbackId = CryptoJS.SHA256(Date.now().toString()).toString();
      this.deviceId = fallbackId;
      return fallbackId;
    }
  }

  /**
   * Check if user can submit a new report (rate limiting)
   */
  static async canSubmitReport(): Promise<{ allowed: boolean; reason?: string; waitTime?: number }> {
    try {
      const now = Date.now();

      // Check last report time (5-minute cooldown)
      const lastReportTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REPORT_TIME);
      if (lastReportTime && lastReportTime !== null) {
        const timeSinceLastReport = now - parseInt(lastReportTime);
        const cooldownMs = CONFIG.RATE_LIMIT_MINUTES * 60 * 1000;
        
        if (timeSinceLastReport < cooldownMs) {
          const waitTime = Math.ceil((cooldownMs - timeSinceLastReport) / 60000);
          return {
            allowed: false,
            reason: `Please wait ${waitTime} minutes before submitting another report`,
            waitTime
          };
        }
      }

      // Check daily limit
      const today = new Date().toDateString();
      const dailyCountKey = `${STORAGE_KEYS.DAILY_REPORT_COUNT}_${today}`;
      const dailyCount = await AsyncStorage.getItem(dailyCountKey);
      const currentCount = dailyCount && dailyCount !== null ? parseInt(dailyCount) : 0;

      if (currentCount >= CONFIG.MAX_REPORTS_PER_DAY) {
        return {
          allowed: false,
          reason: `Daily report limit reached (${CONFIG.MAX_REPORTS_PER_DAY} reports per day)`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking report rate limit:', error);
      return { allowed: true }; // Default to allowing if check fails
    }
  }

  /**
   * Submit a new community report
   */
  static async submitReport(submission: ReportSubmission): Promise<{ success: boolean; error?: string; reportId?: string }> {
    try {
      // Check rate limiting
      const rateLimitCheck = await this.canSubmitReport();
      if (!rateLimitCheck.allowed) {
        return { success: false, error: rateLimitCheck.reason };
      }

      const deviceId = await this.getDeviceId();
      if (!deviceId) {
        return { success: false, error: 'Failed to generate device identifier' };
      }
      
      const now = Date.now();
      
      // Anonymize location for privacy
      const anonymizedLocation = LocationService.anonymizeLocation(submission.location);

      // Create report
      const report: CommunityReport = {
        id: CryptoJS.SHA256(deviceId + now.toString()).toString().substring(0, 12),
        type: submission.type,
        location: anonymizedLocation,
        timestamp: now,
        priority: submission.urgency,
        verified: false, // Reports start unverified
        deviceHash: CryptoJS.SHA256(deviceId).toString().substring(0, 8),
        expiresAt: now + (CONFIG.REPORT_EXPIRY_HOURS * 60 * 60 * 1000)
      };

      // Save to local storage
      await this.saveReport(report);

      // Update rate limiting tracking
      await this.updateRateLimitTracking();

      // Trigger notifications for nearby community members
      await this.triggerCommunityNotifications(report);

      // In a real app, this would also sync to a backend
      // await this.syncToBackend(report);

      return { success: true, reportId: report.id };
    } catch (error) {
      console.error('Error submitting report:', error);
      return { success: false, error: 'Failed to submit report. Please try again.' };
    }
  }

  /**
   * Trigger notifications for nearby community members
   */
  private static async triggerCommunityNotifications(report: CommunityReport): Promise<void> {
    try {
      // Check if this is a report that should trigger notifications
      if (this.shouldTriggerNotification(report)) {
        await NotificationService.checkForNearbyReports(report);
        console.log('�� Notification check triggered for new report:', report.type);
      }
    } catch (error) {
      console.error('Error triggering community notifications:', error);
    }
  }

  /**
   * Determine if a report should trigger notifications
   */
  private static shouldTriggerNotification(report: CommunityReport): boolean {
    // Don't trigger notifications for our own reports
    const isOwnReport = false; // This would be determined by checking if deviceHash matches current user
    
    // Always trigger for high-priority safety reports
    const isHighPrioritySafetyReport = report.priority === 'high' && 
      [CONFIG.REPORT_TYPES.ICE_CHECKPOINT, CONFIG.REPORT_TYPES.ICE_RAID, 
       CONFIG.REPORT_TYPES.ICE_PATROL, CONFIG.REPORT_TYPES.ICE_DETENTION].includes(report.type);
    
    // Trigger for verified community support if enabled
    const isCommunitySupport = report.type === CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT;
    
    return !isOwnReport && (isHighPrioritySafetyReport || isCommunitySupport);
  }

  /**
   * Get all active community reports
   */
  static async getActiveReports(): Promise<CommunityReport[]> {
    try {
      const reportsJson = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
      if (!reportsJson) return [];

      const reports: CommunityReport[] = JSON.parse(reportsJson);
      const now = Date.now();

      // Filter out expired reports
      const activeReports = reports.filter(report => report.expiresAt > now);

      // Save filtered list (cleanup expired reports)
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(activeReports));

      return activeReports;
    } catch (error) {
      console.error('Error getting active reports:', error);
      return [];
    }
  }

  /**
   * Get reports within radius of user location
   */
  static async getNearbyReports(userLocation: { latitude: number; longitude: number }, radiusKm: number = CONFIG.ALERT_RADIUS_KM): Promise<CommunityReport[]> {
    try {
      const allReports = await this.getActiveReports();
      
      return allReports.filter(report => {
        const distance = LocationService.calculateDistance(userLocation, report.location);
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting nearby reports:', error);
      return [];
    }
  }

  /**
   * Get user's own reports
   */
  static async getUserReports(): Promise<CommunityReport[]> {
    try {
      const userReportsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_REPORTS);
      if (!userReportsJson) return [];

      const userReports: CommunityReport[] = JSON.parse(userReportsJson);
      const now = Date.now();

      // Filter out expired reports
      return userReports.filter(report => report.expiresAt > now);
    } catch (error) {
      console.error('Error getting user reports:', error);
      return [];
    }
  }

  /**
   * Check if location has high priority reports
   */
  static async hasHighPriorityAlert(userLocation: { latitude: number; longitude: number }): Promise<boolean> {
    try {
      const nearbyReports = await this.getNearbyReports(userLocation, CONFIG.HIGH_PRIORITY_RADIUS_KM);
      return nearbyReports.some(report => 
        report.priority === 'high' && 
        report.type !== CONFIG.REPORT_TYPES.COMMUNITY_SUPPORT
      );
    } catch (error) {
      console.error('Error checking high priority alerts:', error);
      return false;
    }
  }

  /**
   * Private: Save report to local storage
   */
  private static async saveReport(report: CommunityReport): Promise<void> {
    try {
      // Save to community reports
      const reportsJson = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
      const reports: CommunityReport[] = reportsJson ? JSON.parse(reportsJson) : [];
      reports.push(report);
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

      // Save to user's personal reports
      const userReportsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_REPORTS);
      const userReports: CommunityReport[] = userReportsJson ? JSON.parse(userReportsJson) : [];
      userReports.push(report);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_REPORTS, JSON.stringify(userReports));
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  /**
   * Private: Update rate limiting tracking
   */
  private static async updateRateLimitTracking(): Promise<void> {
    try {
      const now = Date.now();
      
      // Update last report time
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_REPORT_TIME, now.toString());

      // Update daily count
      const today = new Date().toDateString();
      const dailyCountKey = `${STORAGE_KEYS.DAILY_REPORT_COUNT}_${today}`;
      const dailyCount = await AsyncStorage.getItem(dailyCountKey);
      const currentCount = dailyCount ? parseInt(dailyCount) : 0;
      await AsyncStorage.setItem(dailyCountKey, (currentCount + 1).toString());
    } catch (error) {
      console.error('Error updating rate limit tracking:', error);
    }
  }

  /**
   * Clear all local data (for privacy/testing)
   */
  static async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.REPORTS),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_REPORTS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_REPORT_TIME),
        AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_ID)
      ]);

      // Clear daily counts
      const keys = await AsyncStorage.getAllKeys();
      const dailyCountKeys = keys.filter(key => key.includes(STORAGE_KEYS.DAILY_REPORT_COUNT));
      await AsyncStorage.multiRemove(dailyCountKeys);

      this.deviceId = null;
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Generate sample reports for testing/demo
   */
  static async generateSampleReports(userLocation: { latitude: number; longitude: number }): Promise<void> {
    if (!__DEV__) return; // Only in development

    const sampleReports: ReportSubmission[] = [
      {
        type: 'checkpoint' as keyof typeof CONFIG.REPORT_TYPES,
        location: {
          latitude: userLocation.latitude + 0.01,
          longitude: userLocation.longitude + 0.01
        },
        urgency: 'medium'
      },
      {
        type: 'patrol' as keyof typeof CONFIG.REPORT_TYPES,
        location: {
          latitude: userLocation.latitude - 0.005,
          longitude: userLocation.longitude + 0.005
        },
        urgency: 'low'
      },
      {
        type: 'support' as keyof typeof CONFIG.REPORT_TYPES,
        location: {
          latitude: userLocation.latitude + 0.005,
          longitude: userLocation.longitude - 0.005
        },
        urgency: 'low'
      }
    ];

    for (const submission of sampleReports) {
      const deviceId = await this.getDeviceId();
      const now = Date.now() - Math.random() * 2 * 60 * 60 * 1000; // Random time within last 2 hours
      
      const report: CommunityReport = {
        id: CryptoJS.SHA256(deviceId + now.toString() + Math.random().toString()).toString().substring(0, 12),
        type: submission.type,
        location: LocationService.anonymizeLocation(submission.location),
        timestamp: now,
        priority: submission.urgency,
        verified: Math.random() > 0.3, // 70% verified
        deviceHash: CryptoJS.SHA256(deviceId + Math.random().toString()).toString().substring(0, 8),
        expiresAt: now + (CONFIG.REPORT_EXPIRY_HOURS * 60 * 60 * 1000)
      };

      const reportsJson = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
      const reports: CommunityReport[] = reportsJson ? JSON.parse(reportsJson) : [];
      reports.push(report);
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }
  }
} 