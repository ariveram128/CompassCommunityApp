import Constants from 'expo-constants';

// Get environment from Expo config
const ENV = Constants.expoConfig?.extra?.environment || 'development';
const IS_DEV = ENV === 'development';
const IS_STAGING = ENV === 'staging';
const IS_PRODUCTION = ENV === 'production';

// Environment-specific configuration
const getConfig = () => {
  const baseConfig = {
    // App Information
    APP_NAME: Constants.expoConfig?.name || 'Compass Community',
    APP_VERSION: Constants.expoConfig?.version || '1.0.0',
    ENVIRONMENT: ENV,
    
    // Development flags
    IS_DEV,
    IS_STAGING,
    IS_PRODUCTION,
    
    // Features from Expo config
    ENABLE_ANALYTICS: Constants.expoConfig?.extra?.enableAnalytics || false,
    ENABLE_CRASH_REPORTING: Constants.expoConfig?.extra?.enableCrashReporting || false,
    
    // API Configuration
    API_BASE_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
    API_TIMEOUT: 10000,
    
    // Location Configuration
    LOCATION_PRECISION: 3, // Decimal places for privacy (100m grid)
    LOCATION_UPDATE_INTERVAL: IS_PRODUCTION ? 300000 : 30000, // 5 min prod, 30s dev
    BACKGROUND_LOCATION_ENABLED: true,
    
    // Alert System Configuration
    ALERT_RADIUS_KM: 8,
    HIGH_PRIORITY_RADIUS_KM: 3,
    
    // Report System Configuration
  REPORT_EXPIRY_HOURS: 4,
    MAX_REPORTS_PER_DAY: IS_PRODUCTION ? 5 : 20, // Stricter limits in production
    RATE_LIMIT_MINUTES: IS_PRODUCTION ? 5 : 1, // 5 min cooldown in prod, 1 min in dev
    
    // Verification System Configuration
    VERIFICATION_DISTANCE_LIMIT_KM: 10,
    VERIFICATION_COOLDOWN_MINUTES: 2,
    MAX_VERIFICATIONS_PER_DAY: 20,
    VERIFICATION_EXPIRY_DAYS: 30,
    
    // Trust System Configuration
    TRUST_DECAY_DAYS: 90,
    MIN_TRUST_SCORE: 0.1,
    MAX_TRUST_SCORE: 1.0,
    STARTING_TRUST_SCORE: 0.5,
    
    // Notification Configuration
    MAX_NOTIFICATIONS_PER_DAY: 10,
    NOTIFICATION_COOLDOWN_MINUTES: 5,
    QUIET_HOURS_START: '22:00',
    QUIET_HOURS_END: '08:00',
    
    // Performance Configuration
    MAX_CACHED_REPORTS: IS_PRODUCTION ? 100 : 50,
    CLEANUP_INTERVAL_MINUTES: IS_PRODUCTION ? 60 : 10,
    
    // Security Configuration
    HASH_ROUNDS: IS_PRODUCTION ? 12 : 8,
    SESSION_TIMEOUT_HOURS: 24,
  
    // Logging Configuration
    LOG_LEVEL: IS_PRODUCTION ? 'error' : 'debug',
    ENABLE_VERBOSE_LOGGING: IS_DEV,
    
    // Report Types
    REPORT_TYPES: {
      ICE_CHECKPOINT: {
        label: 'Checkpoint',
        color: '#EF4444',
        icon: 'shield-outline',
        priority: 'high'
      },
      ICE_RAID: {
        label: 'Raid Activity',
        color: '#DC2626',
        icon: 'warning',
        priority: 'high'
      },
      ICE_PATROL: {
        label: 'Patrol Activity',
        color: '#F59E0B',
        icon: 'eye',
        priority: 'medium'
      },
      ICE_DETENTION: {
        label: 'Detention Activity',
        color: '#B91C1C',
        icon: 'lock-closed',
        priority: 'high'
      },
      COMMUNITY_SUPPORT: {
        label: 'Community Support',
        color: '#10B981',
        icon: 'heart',
        priority: 'low'
      }
    }
  };

  // Environment-specific overrides
  if (IS_DEV) {
    return {
      ...baseConfig,
      // Development-specific settings
      API_TIMEOUT: 30000,
      ENABLE_VERBOSE_LOGGING: true,
      MAX_REPORTS_PER_DAY: 50
    };
  }

  if (IS_STAGING) {
    return {
      ...baseConfig,
      // Staging-specific settings
      ENABLE_CRASH_REPORTING: true,
      LOG_LEVEL: 'warn'
    };
  }

  if (IS_PRODUCTION) {
    return {
      ...baseConfig,
      // Production-specific settings
      ENABLE_CRASH_REPORTING: true,
      ENABLE_ANALYTICS: true,
      LOG_LEVEL: 'error',
      ENABLE_VERBOSE_LOGGING: false
    };
  }

  return baseConfig;
};

export const CONFIG = getConfig();

// Utility functions for environment checking
export const isDevelopment = () => IS_DEV;
export const isStaging = () => IS_STAGING;
export const isProduction = () => IS_PRODUCTION;
export const getEnvironment = () => ENV;

// Configuration validation
export const validateConfig = () => {
  const required = ['APP_NAME', 'APP_VERSION', 'ENVIRONMENT'];
  const missing = required.filter(key => !CONFIG[key]);
  
  if (missing.length > 0) {
    console.error('Missing required configuration:', missing);
    return false;
  }
  
  return true;
};

// Export individual configs for easier imports
export const {
  APP_NAME,
  APP_VERSION,
  ENVIRONMENT,
  API_BASE_URL,
  ALERT_RADIUS_KM,
  HIGH_PRIORITY_RADIUS_KM,
  REPORT_TYPES,
  LOCATION_PRECISION,
  LOCATION_UPDATE_INTERVAL
} = CONFIG;
