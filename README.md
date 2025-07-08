# Compass Community

A privacy-first mobile application for anonymous community safety reporting and alerts, designed to protect immigrant communities through secure, anonymous reporting of ICE (Immigration and Customs Enforcement) activity.

## 🛡️ Mission

Provide communities with a secure, anonymous platform to share time-sensitive safety information while protecting user privacy and maintaining legal compliance.

## ✨ Key Features

### 🔒 Privacy-First Architecture

- **Anonymous Reporting**: No user accounts, profiles, or personal data collection
- **Location Anonymization**: GPS coordinates rounded to ~100m grid for privacy protection
- **Auto-Expiring Data**: All reports automatically deleted after 4 hours
- **Local-First**: Core features work without server dependency
- **No Tracking**: Zero user tracking, analytics, or behavioral data collection
- **Secure API Keys**: Environment variables protect sensitive configurations

### 🌐 Multi-Language Support

- **Bilingual Interface**: Full Spanish and English language support
- **Dynamic Language Detection**: Automatically detects device language on first launch
- **Seamless Language Switching**: Change language anytime from settings
- **Localized Content**: All UI text, onboarding, and notifications translated
- **Cultural Adaptation**: Language-appropriate messaging and terminology

### 📱 User Experience & Onboarding

- **Comprehensive Onboarding**: Step-by-step privacy and feature explanation
- **Interactive Tutorial**: Learn app features with hands-on guidance
- **Privacy Education**: Clear explanation of data protection measures
- **Accessibility-First**: Dark theme, large touch targets, clear navigation
- **Intuitive Design**: Clean, modern interface designed for all technical skill levels

### 📍 Community Safety Features

- **Interactive Map**: Real-time community reports displayed with Google Maps integration
- **Geofenced Alerts**: Receive notifications within 8km radius of reported activity
- **Report Types**: Checkpoints, raids, patrols, detentions, and community support
- **Photo Evidence**: Optional photo attachment with privacy warnings
- **Rate Limiting**: Prevents spam with 5-minute cooldowns and daily limits
- **Priority Levels**: Low, medium, and high urgency reporting
- **Emergency Tools**: Placeholder for panic button and emergency features (coming soon)

### 🛠️ Technical Highlights

- **Cross-Platform**: React Native with Expo for iOS and Android
- **Development Builds**: Custom EAS builds with native configurations
- **Offline Capable**: Core features work without internet connectivity
- **Battery Optimized**: Efficient location tracking and background processing
- **Secure Storage**: Encrypted local data storage using Expo SecureStore
- **Modern UI**: Dark-themed, accessibility-focused interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ with npm
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio or Xcode (for emulators)
- Google Maps API key ([Get one here](https://developers.google.com/maps/documentation/android-sdk/get-api-key))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/compass-community.git
cd CompassCommunityApp

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys (see Environment Setup below)
```

### Environment Setup

1. **Create `.env.local` file** (ignored by git):

```bash
# Environment Variables for Compass Community App
# This file is ignored by git for security

# Google Maps API Key  
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

2. **Set up EAS environment variables** for builds:

```bash
# Add API key for development builds
npx eas env:create --name GOOGLE_MAPS_API_KEY --value your-api-key-here --environment development

# Add API key for production builds  
npx eas env:create --name GOOGLE_MAPS_API_KEY --value your-api-key-here --environment production
```

### Development

```bash
# Start development server
npx expo start

# For development builds (recommended)
npx expo start --dev-client

# Platform-specific commands
npx expo start --android    # Android emulator
npx expo start --ios        # iOS simulator (macOS only)
npx expo start --web        # Web browser
```

### Building the App

```bash
# Configure EAS build
npx eas build:configure

# Create development build (includes all native features)
npx eas build --platform android --profile development
npx eas build --platform ios --profile development

# Create production build
npx eas build --platform all --profile production
```

## 📱 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **Android** | ✅ Full Support | Location, maps, notifications, photo capture |
| **iOS** | ✅ Full Support | Location, maps, notifications, photo capture |
| **Web** | 🔶 Limited | Report submission, settings (no maps/location) |

## 🏗️ Technology Stack

### Frontend Framework

- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based navigation system
- **TypeScript**: Type-safe development with some legacy JS files
- **React Hooks**: Modern state management

### Core Services

- **Expo Location**: Privacy-focused location services
- **Expo Notifications**: Local push notifications
- **React Native Maps**: Interactive mapping with Google Maps
- **Expo ImagePicker**: Secure photo capture for reports
- **Expo SecureStore**: Encrypted local storage

### Security & Privacy

- **EAS Environment Variables**: Secure API key management
- **Custom Anonymization**: Location fuzzing and data minimization
- **Local Data Storage**: No server dependency for core features
- **Auto-Expiring Data**: Automatic cleanup of sensitive information

## 📂 Project Structure

```
CompassCommunityApp/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout and navigation
│   ├── index.tsx          # Home screen with map and emergency tools placeholder
│   ├── report.tsx         # Anonymous report submission with photos
│   ├── settings.tsx       # Privacy controls and preferences with language settings
│   └── legal.tsx          # Privacy policy and terms of service
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Map/          # Map components (web/native platform aware)
│   │   ├── Report/       # Report form components
│   │   ├── Onboarding/   # Complete onboarding flow (welcome, privacy, features)
│   │   ├── Privacy/      # Privacy-related UI components
│   │   └── UI/           # Generic UI elements and design system
│   ├── services/         # Core business logic
│   │   ├── Location/     # Location and geofencing services
│   │   ├── Report/       # Report management and storage
│   │   ├── Notification/ # Alert and notification management
│   │   ├── Storage/      # Data persistence and cleanup
│   │   ├── Onboarding/   # Onboarding state management
│   │   ├── Verification/ # Community report verification system
│   │   └── i18n/         # Internationalization service and translations
│   ├── hooks/            # Custom React hooks
│   │   ├── useLocation.js # Location state management
│   │   ├── useReports.ts  # Report state management
│   │   ├── useTranslation.tsx # Translation and language switching
│   │   └── useVerification.ts # Community verification features
│   ├── utils/            # Helper functions
│   ├── constants/        # App configuration
│   └── types/            # TypeScript type definitions
├── assets/               # Images, icons, and static files
├── .env.local           # Local environment variables (gitignored)
├── .env.local.example   # Template for environment setup
├── app.json             # Expo configuration
├── eas.json             # EAS build configuration
└── docs/                # Additional documentation
```

## 🔧 Configuration

### Privacy Settings (`src/constants/config.js`)

```javascript
export const CONFIG = {
  // Privacy Protection
  LOCATION_PRECISION: 3,          // ~100m anonymization
  REPORT_EXPIRY_HOURS: 4,         // Auto-delete reports
  MAX_REPORTS_PER_DAY: 5,         // Prevent spam
  RATE_LIMIT_MINUTES: 5,          // Cooldown between reports
  
  // Geofencing
  ALERT_RADIUS_KM: 8,             // Alert notification radius
  HIGH_PRIORITY_RADIUS_KM: 3,     // High-priority alert radius
  
  // Report Types
  REPORT_TYPES: {
    CHECKPOINT: { name: 'Checkpoint', priority: 'high' },
    RAID: { name: 'Raid', priority: 'high' },
    PATROL: { name: 'Patrol', priority: 'medium' },
    DETENTION: { name: 'Detention', priority: 'high' },
    COMMUNITY_SUPPORT: { name: 'Community Support', priority: 'low' }
  }
};
```

## 🔐 Security & Privacy Architecture

### Environment Variable Security

- **Local Development**: `.env.local` file (gitignored)
- **EAS Builds**: Secure environment variables in Expo dashboard
- **API Keys**: Never committed to version control
- **Project ID**: Safe to keep in `app.json` (public identifier)

### Data Minimization

```javascript
// Location anonymization example
static anonymizeLocation(coords) {
  const precision = CONFIG.LOCATION_PRECISION; // 3 decimal places ≈ 100m
  return {
    latitude: Math.round(coords.latitude * Math.pow(10, precision)) / Math.pow(10, precision),
    longitude: Math.round(coords.longitude * Math.pow(10, precision)) / Math.pow(10, precision),
    timestamp: Date.now(),
    // Removed: exact altitude, speed, heading, accuracy
  };
}
```

### Report Privacy

- **Anonymous Device IDs**: Hashed for rate limiting only
- **Photo Privacy**: Optional with explicit consent warnings
- **Location Fuzzing**: ~100m grid anonymization
- **Auto-Expiry**: All data deleted after 4 hours
- **No Tracking**: Zero behavioral analytics or user profiling

## 🧪 Current Development Status

### ✅ Completed Features

- **Core App Structure**: Expo Router navigation, dark UI theme
- **Location Services**: Permission handling, background monitoring
- **Interactive Maps**: Google Maps integration with anonymized markers
- **Report System**: Full report submission with photo support
- **Privacy Settings**: User controls for location and notifications
- **Security Setup**: Environment variables and API key protection
- **Cross-Platform**: Android/iOS development builds working
- **Developer Tools**: Sample data generation, testing utilities

### 🚧 In Progress

- **iOS Production Builds**: Requires Apple Developer account ($99/year)
- **Photo Upload Optimization**: Compression and privacy enhancements
- **TypeScript Migration**: Converting remaining JS files to TS
- **Advanced Analytics**: Anonymous usage metrics for improvement

### 📋 Planned Features

- **Community Verification**: Peer verification system for reports
- **Multi-Language Support**: Spanish, Portuguese, and other languages
- **Accessibility Improvements**: Screen reader and keyboard navigation
- **Offline Map Caching**: Pre-download map tiles for offline use
- **Emergency Contacts**: Quick access to legal aid and support services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Set up your local environment with `.env.local`
4. Make your changes following the privacy-first principles
5. Test on both Android and iOS if possible
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Follow existing privacy patterns
- Use TypeScript for new files
- Test location anonymization thoroughly
- Document any new privacy considerations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions about app usage or to report issues:

- **GitHub Issues**: Technical problems and feature requests
- **Security Issues**: Contact maintainers privately for security vulnerabilities
- **Community Support**: [Insert community forum/Discord link]

## ⚠️ Disclaimer

This app is designed to help communities stay safe through anonymous information sharing. Users should:

- Never put themselves at risk to gather information
- Verify information through multiple sources when possible
- Understand that reports are unverified community submissions
- Follow all local laws and regulations
- Prioritize personal safety over documentation

**The developers are not responsible for how this tool is used or any consequences of its use. This is a community safety tool, not a replacement for emergency services.**
