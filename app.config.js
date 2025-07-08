export default ({ config }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    ...config,
    name: isProduction ? 'Compass Community' : `Compass Community ${isStaging ? '(Staging)' : '(Dev)'}`,
    slug: 'compass-community',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'compass-community',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1a1a1a'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      bundleIdentifier: isProduction 
        ? 'org.community.compass' 
        : `org.community.compass.${isStaging ? 'staging' : 'dev'}`,
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'This app uses location to provide community safety alerts in your area.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'This app uses background location to send emergency alerts when activity is reported nearby.'
      }
    },
    android: {
      package: isProduction 
        ? 'org.community.compass' 
        : `org.community.compass.${isStaging ? 'staging' : 'dev'}`,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_BACKGROUND_LOCATION',
        'android.permission.FOREGROUND_SERVICE',
        'android.permission.FOREGROUND_SERVICE_LOCATION'
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || '$GOOGLE_MAPS_API_KEY'
        }
      }
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      ...(isDev ? ['expo-dev-client'] : []),
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow Compass Community to use your location to provide safety alerts in your area.',
          locationAlwaysPermission: 'Allow Compass Community to use your location in the background to send emergency alerts when activity is reported nearby.',
          locationWhenInUsePermission: 'Allow Compass Community to use your location to provide safety alerts in your area.',
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: 'd535c5a5-9e0c-4b8c-9e59-59fed73ba426'
      },
      environment: process.env.NODE_ENV || 'development',
      apiUrl: isProduction 
        ? 'https://api.compasscommunity.org' 
        : isStaging 
          ? 'https://staging-api.compasscommunity.org'
          : 'http://localhost:3000',
      enableAnalytics: isProduction,
      enableCrashReporting: !isDev
    },
    updates: {
      url: 'https://u.expo.dev/d535c5a5-9e0c-4b8c-9e59-59fed73ba426'
    }
  };
}; 