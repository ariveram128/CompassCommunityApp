# ICE Community Alert

A privacy-first mobile application for anonymous community safety reporting and alerts regarding ICE (Immigration and Customs Enforcement) activity.

## 🛡️ Mission

Provide communities with a secure, anonymous platform to share time-sensitive safety information while protecting user privacy and maintaining legal compliance.

## ✨ Key Features

### 🔒 Privacy-First Architecture
- **Anonymous Reporting**: No user accounts, profiles, or personal data collection
- **Location Anonymization**: GPS coordinates rounded to ~100m grid for privacy protection
- **Auto-Expiring Data**: All reports automatically deleted after 4 hours
- **Local-First**: Notifications and core features work without server dependency
- **No Tracking**: Zero user tracking, analytics, or behavioral data collection

### 📍 Community Safety Features
- **Geofenced Alerts**: Receive notifications within 8km radius of reported activity
- **Real-time Map**: Anonymous community reports displayed on interactive map
- **Multiple Report Types**: Checkpoints, raids, patrols, detentions, and community support
- **Rate Limiting**: Prevents spam with 5-minute cooldowns and daily limits
- **Background Monitoring**: Optional background location for emergency alerts

### 🛠️ Technical Highlights
- **Cross-Platform**: React Native with Expo for iOS and Android
- **Offline Capable**: Core features work without internet connectivity
- **Battery Optimized**: Efficient location tracking and background processing
- **Secure Storage**: Encrypted local data storage using Expo SecureStore
- **Modern UI**: Dark-themed, accessibility-focused interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio or Xcode (for emulators)
- Expo Go app (for physical device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ice-community-alert.git
cd ice-community-alert

# Install dependencies
npm install

# Install Expo packages
npx expo install expo-location expo-notifications expo-secure-store expo-crypto expo-device expo-network expo-constants

# Install additional utilities
npm install @react-native-async-storage/async-storage crypto-js date-fns

# Install UI and navigation
npx expo install @expo/vector-icons expo-status-bar react-native-safe-area-context react-native-maps
```

### Development Setup

```bash
# Start development server
npx expo start

# Run on platforms
npx expo start --android    # Android emulator
npx expo start --ios        # iOS simulator (macOS only)
npx expo start --web        # Web browser

# For physical device testing
# Scan QR code with Expo Go app
```

## 📱 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **Android** | ✅ Full Support | Location, notifications, background monitoring |
| **iOS** | ✅ Full Support | Location, notifications, background monitoring |
| **Web** | 🔶 Limited | Map view, reporting (no background location) |

## 🏗️ Technology Stack

### Frontend Framework
- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based navigation system
- **TypeScript**: Type-safe development
- **React Hooks**: Modern state management

### Core Services
- **Expo Location**: Privacy-focused location services
- **Expo Notifications**: Local push notifications
- **Expo SecureStore**: Encrypted local storage
- **React Native Maps**: Interactive mapping with anonymized markers

### Security & Privacy
- **Expo Crypto**: Cryptographic functions for data anonymization
- **CryptoJS**: Client-side encryption and hashing
- **AsyncStorage**: Non-sensitive local data storage
- **Custom Anonymization**: Location fuzzing and data minimization

## 📂 Project Structure

```
CompassCommunityApp/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout and navigation
│   ├── index.tsx          # Home screen with map and status
│   ├── report.tsx         # Anonymous report submission
│   └── settings.tsx       # Privacy controls and preferences
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Map/          # Map-related components
│   │   ├── Report/       # Report form components
│   │   ├── Alert/        # Alert and notification components
│   │   └── UI/           # Generic UI elements
│   ├── services/         # Core business logic
│   │   ├── Location/     # Location and geofencing services
│   │   ├── Encryption/   # Data anonymization and encryption
│   │   ├── Notification/ # Alert and notification management
│   │   ├── API/          # Backend communication (optional)
│   │   └── Storage/      # Data persistence and cleanup
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions and utilities
│   ├── constants/        # App configuration and constants
│   └── types/            # TypeScript type definitions
├── assets/               # Images, icons, and static files
└── docs/                 # Additional documentation
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
  
  // Security
  ENCRYPTION_KEY_SIZE: 256,       // AES encryption strength
  DEVICE_ID_HASH_ROUNDS: 10,      // PBKDF2 iterations
  SESSION_TIMEOUT_MINUTES: 30,    // App session timeout
};
```

### Permissions Required

#### Android (`app.json`)
- `ACCESS_FINE_LOCATION`: For community alert geofencing
- `ACCESS_BACKGROUND_LOCATION`: For emergency background alerts
- `RECEIVE_BOOT_COMPLETED`: For persistent alert monitoring

#### iOS (`app.json`)
- `NSLocationWhenInUseUsageDescription`: Community safety alerts
- `NSLocationAlwaysAndWhenInUseUsageDescription`: Background emergency alerts
- `NSUserTrackingUsageDescription`: Explicitly states no user tracking

## 🔐 Security & Privacy Architecture

### Data Minimization
```javascript
// Example: Location anonymization
static anonymizeLocation(coords) {
  const precision = CONFIG.LOCATION_PRECISION; // 3 decimal places ≈ 100m
  return {
    latitude: Math.round(coords.latitude * 1000) / 1000,
    longitude: Math.round(coords.longitude * 1000) / 1000,
    timestamp: Date.now(),
    // Removed: exact altitude, speed, heading, accuracy
  };
}
```

### Encryption Strategy
- **No persistent user data**: Zero long-term storage of personal information
- **Ephemeral encryption**: One-time keys for report submission
- **Hash-based rate limiting**: Location-based cooldowns without tracking
- **Device fingerprinting**: Non-invasive device identification for spam prevention

### Privacy Compliance
- **GDPR Ready**: No personal data collection or processing
- **CCPA Compliant**: No data sale or sharing with third parties
- **Anonymous by Design**: Technical impossibility of user identification
- **Minimal Data Collection**: Only essential information for community safety

## 🧪 Testing

### Unit Testing
```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### E2E Testing
```bash
# Run end-to-end tests
npx detox test
```

### Manual Testing Checklist
- [ ] Location permission flow
- [ ] Anonymous report submission
- [ ] Geofenced notifications
- [ ] Data auto-expiration
- [ ] Rate limiting functionality
- [ ] Background location accuracy
- [ ] Cross-platform compatibility

## 🚢 Deployment

### Development Build
```bash
# Create development build
npx eas build --profile development --platform android
npx eas build --profile development --platform ios
```

### Production Release
```bash
# Build for app stores
npx eas build --profile production --platform all

# Submit to stores
npx eas submit --platform android
npx eas submit --platform ios
```

### Environment Configuration
- **Development**: Local testing with mock data
- **Staging**: Pre-production testing with anonymized backend
- **Production**: Live community deployment with full privacy controls

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Implement changes with tests
4. Ensure privacy compliance
5. Submit pull request with detailed description

### Code Standards
- **Privacy First**: All code must maintain user anonymity
- **Security Review**: Encryption and data handling requires review
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Performance**: Battery and data usage optimization
- **Documentation**: Clear comments for security-critical code

### Reporting Issues
- Use GitHub Issues for bug reports
- Include device, OS version, and reproduction steps
- Never include real location data or personal information in reports

## 📄 Legal & Compliance

### Disclaimer
This application is designed for community safety and information sharing. Users are responsible for:
- Ensuring local legal compliance when using location services
- Reporting only factual, time-sensitive safety information
- Understanding that the app provides tools, not legal advice
- Following local laws regarding photography, recording, and reporting

### Data Policy
- **No User Tracking**: Technical architecture prevents user identification
- **Automatic Deletion**: All reports expire and are permanently deleted after 4 hours
- **Location Privacy**: GPS coordinates are anonymized and fuzzed for privacy
- **No Data Sale**: Zero commercial use of any user-generated data

### Open Source License
MIT License - See `LICENSE` file for details

## 📞 Support & Community

### Documentation
- 📖 [Technical Documentation](./docs/)
- 🔒 [Privacy Architecture](./docs/privacy.md)
- 🛡️ [Security Guidelines](./docs/security.md)
- 🚀 [Deployment Guide](./docs/deployment.md)

### Community Resources
- 💬 [Community Guidelines](./docs/community-guidelines.md)
- 🆘 [Emergency Contacts](./docs/emergency-resources.md)
- 🔧 [Troubleshooting](./docs/troubleshooting.md)

### Contact
- **Technical Issues**: Create GitHub Issue
- **Security Concerns**: security@community-alert.org
- **General Questions**: community@community-alert.org

---

**Built with ❤️ for community safety and privacy**

*This project prioritizes user privacy, community safety, and legal compliance. All code and architecture decisions are made with these principles in mind.*