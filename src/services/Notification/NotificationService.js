import * as Device from 'expo-device';
import { Platform } from 'react-native';

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

export class NotificationService {
  static expoPushToken = null;
  static notificationListeners = new Set();

  static async initialize() {
    try {
      if (!notificationsAvailable) {
        console.log('Notification service: Running in limited mode (Expo Go)');
        return;
      }

      await this.requestPermissions();
      await this.configureNotificationChannels();
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
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
        await Notifications.setNotificationChannelAsync('ice-alerts', {
          name: 'ICE Activity Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B35',
          sound: 'default',
          description: 'Critical alerts about ICE activity in your area'
        });
      } catch (error) {
        console.error('Error configuring notification channels:', error);
      }
    }
  }

  static async scheduleLocalNotification({
    title,
    body,
    data = {},
    categoryId = 'default',
    priority = 'normal',
    delaySeconds = 0
  }) {
    if (!notificationsAvailable) {
      console.warn('Notifications not available - showing alert instead:', title, body);
      // In Expo Go, we could show an alert or add to a local queue
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Cannot schedule notification: permission denied');
        return null;
      }

      const trigger = delaySeconds > 0 ? { seconds: delaySeconds } : null;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { ...data, timestamp: Date.now(), category: categoryId },
          categoryIdentifier: categoryId,
          sound: priority === 'high' ? 'default' : false,
          priority: priority === 'high' 
            ? Notifications.AndroidImportance.HIGH 
            : Notifications.AndroidImportance.DEFAULT
        },
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

  // Fallback method for when notifications aren't available
  static showFallbackAlert(title, message) {
    console.log(`📱 ${title}: ${message}`);
    // Could implement in-app alert system here
  }
}
