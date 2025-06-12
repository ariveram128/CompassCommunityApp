import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { CONFIG } from '../../constants/config';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static expoPushToken = null;
  static notificationListeners = new Set();

  static async initialize() {
    try {
      await this.requestPermissions();
      await this.configureNotificationChannels();
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  static async requestPermissions() {
    if (!Device.isDevice) {
      console.warn('Notifications not supported on simulator');
      return false;
    }

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
  }

  static async configureNotificationChannels() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('ice-alerts', {
        name: 'ICE Activity Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B35',
        sound: 'default',
        description: 'Critical alerts about ICE activity in your area'
      });
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
}
