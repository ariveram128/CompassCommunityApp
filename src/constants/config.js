export const CONFIG = {
  // Privacy & Security Settings
  LOCATION_PRECISION: 3, // Rounds to ~100m for anonymity
  REPORT_EXPIRY_HOURS: 4,
  MAX_REPORTS_PER_DAY: 5,
  RATE_LIMIT_MINUTES: 5,
  
  // Geofencing Settings
  ALERT_RADIUS_KM: 8, // 8km radius for alerts
  HIGH_PRIORITY_RADIUS_KM: 3, // 3km for high priority alerts
  LOCATION_UPDATE_INTERVAL: 300000, // 5 minutes
  
  // Security Settings
  ENCRYPTION_KEY_SIZE: 256,
  DEVICE_ID_HASH_ROUNDS: 10,
  SESSION_TIMEOUT_MINUTES: 30,
  
  // API Settings
  API_BASE: __DEV__ 
    ? 'https://dev-api.ice-community-alert.org'
    : 'https://api.ice-community-alert.org',
  API_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  
  // Notification Settings
  NOTIFICATION_CATEGORIES: {
    ICE_ACTIVITY: 'ice_activity',
    SYSTEM_ALERT: 'system_alert',
    COMMUNITY_UPDATE: 'community_update'
  },
  
  // Report Categories
  REPORT_TYPES: {
    ICE_CHECKPOINT: 'checkpoint',
    ICE_RAID: 'raid',
    ICE_PATROL: 'patrol',
    ICE_DETENTION: 'detention',
    COMMUNITY_SUPPORT: 'support'
  }
};
