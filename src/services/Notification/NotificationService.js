import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { CONFIG } from '../../constants/config.js';
import { LocationService } from '../Location/LocationService.js';

// Try to import notifications, but handle if not available in Expo Go
let Notifications;
let notificationsAvailable = false;

try {
  Notifications = require('expo-notifications');
  notificationsAvailable = true;
  
  // Configure notification behavior only if available
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.warn('Notifications not available (likely in Expo Go):', error.message);
  notificationsAvailable = false;
}

const NOTIFICATION_STORAGE_KEYS = {
  PREFERENCES: '@notification_preferences',
  LAST_NOTIFICATION_TIME: '@last_notification_time',
  NOTIFICATION_COUNT_TODAY: '@notification_count_today'
};

const DEFAULT_PREFERENCES = {
  enabled: true,
  highPriorityEnabled: true,
  standardAlertsEnabled: true,
  communityUpdatesEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
};

export class NotificationService {
  static expoPushToken = null;
  static notificationListeners = new Set();
  static userLocation = null;
  static preferences = DEFAULT_PREFERENCES;

  static async initialize() {
    try {
      if (!notificationsAvailable) {
        console.log('Notification service: Running in limited mode (Expo Go)');
        return;
      }

      await this.loadPreferences();
      await this.requestPermissions();
      await this.configureNotificationChannels();
      await this.setupNotificationListeners();
      console.log('Push notification service initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  static async loadPreferences() {
    try {
      const prefsJson = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEYS.PREFERENCES);
      if (prefsJson) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(prefsJson) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      this.preferences = DEFAULT_PREFERENCES;
    }
  }

  static async updatePreferences(newPreferences) {
    try {
      this.preferences = { ...this.preferences, ...newPreferences };
      await AsyncStorage.setItem(
        NOTIFICATION_STORAGE_KEYS.PREFERENCES, 
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  static async requestPermissions() {
    if (!notificationsAvailable) {
      console.warn('Notifications not available in this environment');
      return false;
    }

    if (!Device.isDevice) {
      console.warn('Notifications not supported on simulator');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async configureNotificationChannels() {
    if (!notificationsAvailable) {
      return;
    }

    if (Platform.OS === 'android') {
      try {
        // High Priority Channel
        await Notifications.setNotificationChannelAsync('high-priority-alerts', {
          name: 'High Priority Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#EF4444',
          sound: 'default',
          description: 'Critical community safety alerts within 3km',
          bypassDnd: true
        });

        // Standard Alerts Channel
        await Notifications.setNotificationChannelAsync('standard-alerts', {
          name: 'Community Alerts',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 150, 150, 150],
          lightColor: '#F59E0B',
          sound: 'default',
          description: 'Community safety alerts within 8km'
        });

        // Community Updates Channel
        await Notifications.setNotificationChannelAsync('community-updates', {
          name: 'Community Updates',
          importance: Notifications.AndroidImportance.LOW,
          vibrationPattern: [0, 100],
          lightColor: '#10B981',
          sound: false,
          description: 'General community updates and support requests'
        });
      } catch (error) {
        console.error('Error configuring notification channels:', error);
      }
    }
  }

  static async setupNotificationListeners() {
    if (!notificationsAvailable) return;

    try {
      // Listen for notifications received while app is in foreground
      this.notificationListeners.add(
        Notifications.addNotificationReceivedListener(notification => {
          console.log('📱 Notification received:', notification);
        })
      );

      // Listen for notification responses (user tapped notification)
      this.notificationListeners.add(
        Notifications.addNotificationResponseReceivedListener(response => {
          console.log('📱 Notification response:', response);
          this.handleNotificationResponse(response);
        })
      );
    } catch (error) {
      console.error('Error setting up notification listeners:', error);
    }
  }

  static handleNotificationResponse(response) {
    const { notification } = response;
    const { data } = notification.request.content;
    
    // Handle different notification types
    if (data.type === 'community_report') {
      // Could navigate to map view showing the report location
      console.log('User tapped on community report notification');
    }
  }

  static setUserLocation(location) {
    this.userLocation = location;
  }

  static async checkForNearbyReports(newReport) {
    if (!this.preferences.enabled || !this.userLocation) {
      return;
    }

    try {
      const distance = LocationService.calculateDistance(
        this.userLocation, 
        newReport.location
      );

      const isHighPriority = newReport.priority === 'high' || 
                            ['raid', 'detention'].includes(newReport.type);
      
      const isWithinHighPriorityRadius = distance <= CONFIG.HIGH_PRIORITY_RADIUS_KM;
      const isWithinStandardRadius = distance <= CONFIG.ALERT_RADIUS_KM;

      // Determine if we should send notification
      let shouldNotify = false;
      let priority = 'normal';
      let channelId = 'standard-alerts';

      if (isHighPriority && isWithinHighPriorityRadius && this.preferences.highPriorityEnabled) {
        shouldNotify = true;
        priority = 'high';
        channelId = 'high-priority-alerts';
      } else if (isWithinStandardRadius && this.preferences.standardAlertsEnabled) {
        shouldNotify = true;
        channelId = 'standard-alerts';
      } else if (newReport.type === 'support' && this.preferences.communityUpdatesEnabled) {
        shouldNotify = true;
        priority = 'low';
        channelId = 'community-updates';
      }

      if (shouldNotify && await this.canSendNotification()) {
        await this.sendCommunityAlert(newReport, distance, priority, channelId);
      }
    } catch (error) {
      console.error('Error checking for nearby reports:', error);
    }
  }

  static async canSendNotification() {
    // Check quiet hours
    if (this.preferences.quietHoursEnabled && this.isQuietHours()) {
      return false;
    }

    // Check notification rate limiting (max 10 per day)
    const today = new Date().toDateString();
    const countKey = `${NOTIFICATION_STORAGE_KEYS.NOTIFICATION_COUNT_TODAY}_${today}`;
    const todayCount = await AsyncStorage.getItem(countKey);
    const currentCount = todayCount ? parseInt(todayCount) : 0;

    if (currentCount >= 10) {
      return false;
    }

    // Check minimum time between notifications (5 minutes)
    const lastNotificationTime = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEYS.LAST_NOTIFICATION_TIME);
    if (lastNotificationTime) {
      const timeSince = Date.now() - parseInt(lastNotificationTime);
      if (timeSince < 5 * 60 * 1000) { // 5 minutes
        return false;
      }
    }

    return true;
  }

  static isQuietHours() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const startTime = this.parseTime(this.preferences.quietHoursStart);
    const endTime = this.parseTime(this.preferences.quietHoursEnd);
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight quiet hours (e.g., 22:00 to 08:00)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  static parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 100 + minutes;
  }

  static async sendCommunityAlert(report, distance, priority, channelId) {
    const reportTypeLabels = {
      checkpoint: 'Checkpoint',
      raid: 'Raid Activity',
      patrol: 'Patrol Activity', 
      detention: 'Detention Activity',
      support: 'Community Support'
    };

    const urgencyEmojis = {
      high: '🚨',
      medium: '⚠️',
      low: 'ℹ️'
    };

    const title = `${urgencyEmojis[report.priority]} ${reportTypeLabels[report.type]} Nearby`;
    const body = `Reported ${Math.round(distance * 10) / 10}km away • ${this.getTimeAgo(report.timestamp)}`;

    await this.scheduleLocalNotification({
      title,
      body,
      data: {
        type: 'community_report',
        reportId: report.id,
        reportType: report.type,
        distance: distance,
        timestamp: report.timestamp
      },
      categoryId: channelId,
      priority: priority,
      channelId: channelId
    });

    // Update tracking
    await this.updateNotificationTracking();
  }

  static getTimeAgo(timestamp) {
    const ageMinutes = (Date.now() - timestamp) / (1000 * 60);
    if (ageMinutes < 60) return `${Math.round(ageMinutes)}m ago`;
    const ageHours = ageMinutes / 60;
    return `${Math.round(ageHours)}h ago`;
  }

  static async updateNotificationTracking() {
    try {
      const now = Date.now();
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEYS.LAST_NOTIFICATION_TIME, now.toString());

      const today = new Date().toDateString();
      const countKey = `${NOTIFICATION_STORAGE_KEYS.NOTIFICATION_COUNT_TODAY}_${today}`;
      const todayCount = await AsyncStorage.getItem(countKey);
      const currentCount = todayCount ? parseInt(todayCount) : 0;
      await AsyncStorage.setItem(countKey, (currentCount + 1).toString());
    } catch (error) {
      console.error('Error updating notification tracking:', error);
    }
  }

  static async scheduleLocalNotification({
    title,
    body,
    data = {},
    categoryId = 'default',
    priority = 'normal',
    delaySeconds = 0,
    channelId = 'standard-alerts'
  }) {
    if (!notificationsAvailable) {
      console.warn('Notifications not available - showing fallback:', title, body);
      this.showFallbackAlert(title, body);
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Cannot schedule notification: permission denied');
        return null;
      }

      const trigger = delaySeconds > 0 ? { seconds: delaySeconds } : null;

      const notificationContent = {
        title,
        body,
        data: { ...data, timestamp: Date.now(), category: categoryId },
        categoryIdentifier: categoryId,
        sound: this.preferences.soundEnabled ? 'default' : false,
        priority: priority === 'high' 
          ? Notifications.AndroidImportance.HIGH 
          : Notifications.AndroidImportance.DEFAULT
      };

      // Add Android-specific channel
      if (Platform.OS === 'android') {
        notificationContent.android = {
          channelId: channelId,
          priority: priority === 'high' 
            ? Notifications.AndroidImportance.HIGH 
            : Notifications.AndroidImportance.DEFAULT,
          vibrate: this.preferences.vibrationEnabled ? [0, 250, 250, 250] : false
        };
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger
      });

      return identifier;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  // Method to check if notifications are available
  static isAvailable() {
    return notificationsAvailable;
  }

  // Get current preferences
  static getPreferences() {
    return { ...this.preferences };
  }

  // Fallback method for when notifications aren't available
  static showFallbackAlert(title, message) {
    console.log(`📱 ${title}: ${message}`);
    // Could implement in-app alert system here
  }

  // Cleanup method
  static cleanup() {
    this.notificationListeners.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.notificationListeners.clear();
  }
}
