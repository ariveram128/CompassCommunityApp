# 🚀 Production Build Guide - Compass Community

This guide covers how to build and deploy Compass Community for production, staging, and beta testing environments.

## 📋 Prerequisites

1. **EAS CLI**: Install and authenticate

   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

2. **Environment Variables**: Set up environment-specific configurations

   ```bash
   # Copy and configure environment variables
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Developer Accounts**:
   - Apple Developer Program ($99/year) for iOS builds
   - Google Play Console account for Android builds

## 🏗️ Build Profiles

### Development Build

- **Purpose**: Local development with debugging enabled
- **Features**: Developer menu, verbose logging, relaxed rate limits
- **Command**: `npm run start`

### Staging Build  

- **Purpose**: Pre-production testing
- **Features**: Production-like environment but with staging APIs
- **Command**: `npm run build:staging`

### Production Build

- **Purpose**: App store releases
- **Features**: Optimized, analytics enabled, strict security
- **Command**: `npm run build:production`

## 🔧 Environment Configuration

### App Naming Convention

- **Production**: `Compass Community`
- **Staging**: `Compass Community (Staging)`
- **Development**: `Compass Community (Dev)`

### Bundle Identifiers

- **Production**: `org.community.compass`
- **Staging**: `org.community.compass.staging`
- **Development**: `org.community.compass.dev`

### Key Differences by Environment

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Developer Menu | ✅ Enabled | ❌ Disabled | ❌ Disabled |
| Debug Logs | ✅ Verbose | ⚠️ Warnings Only | ❌ Errors Only |
| Rate Limits | 🔓 Relaxed | 🔒 Moderate | 🔒 Strict |
| Crash Reporting | ❌ Disabled | ✅ Enabled | ✅ Enabled |
| Analytics | ❌ Disabled | ❌ Disabled | ✅ Enabled |
| API Timeout | 30s | 10s | 10s |
| Location Updates | 30s | 5min | 5min |

## 🚀 Building for Different Platforms

### Android Builds

#### Staging APK (for internal testing)

```bash
npm run build:android:staging
```

#### Production AAB (for Play Store)

```bash
npm run build:android:production
```

### iOS Builds

#### Staging Build (for TestFlight)

```bash
npm run build:ios:staging
```

#### Production Build (for App Store)

```bash
npm run build:ios:production
```

## 📱 Beta Testing Process

### Android Beta Testing

1. **Build staging APK**: `npm run build:android:staging`
2. **Download and install** on test devices
3. **Collect feedback** via in-app feedback system
4. **Monitor crash reports** and performance

### iOS Beta Testing (Requires Apple Developer Account)

1. **Build staging iOS**: `npm run build:ios:staging`
2. **Upload to TestFlight**: `npm run submit:ios`
3. **Invite beta testers** via TestFlight
4. **Monitor TestFlight feedback** and crashes

## 🔐 Security Configuration

### Production Security Features

- ✅ **No developer menu** access
- ✅ **Encrypted local storage** for sensitive data
- ✅ **Rate limiting** to prevent abuse
- ✅ **Input validation** on all user inputs
- ✅ **Anonymous reporting** with no PII collection
- ✅ **Location anonymization** to 100m grid
- ✅ **Auto-deletion** of reports after 4 hours

### API Key Management

- Store sensitive keys in EAS Secrets (never in code)
- Use environment-specific API endpoints
- Implement proper API key rotation

## 📊 Monitoring & Analytics

### Production Monitoring

- **Crash Reporting**: Automatic error collection and reporting
- **Performance Monitoring**: Track app startup time, memory usage
- **Anonymous Analytics**: Privacy-compliant usage statistics
- **User Feedback**: In-app feedback collection system

### Key Metrics to Monitor

- App crash rate (target: <1%)
- Location permission grant rate
- Report submission success rate
- Notification delivery rate
- Battery usage optimization

## 🧪 Testing Strategy

### Pre-Production Checklist

- [ ] **Functional Testing**: All core features work
- [ ] **Permission Testing**: Location permissions work correctly
- [ ] **Offline Testing**: App handles network failures gracefully
- [ ] **Battery Testing**: Background location usage is optimized
- [ ] **Performance Testing**: App runs smoothly on older devices
- [ ] **Security Testing**: No sensitive data leaks
- [ ] **Accessibility Testing**: Screen readers and high contrast work

### Device Testing Matrix

- **Android**: Test on devices with API levels 23-34
- **iOS**: Test on devices running iOS 13+ (if targeting iOS)
- **Performance**: Test on both high-end and budget devices
- **Network**: Test on WiFi, 4G, and poor network conditions

## 🔄 Deployment Workflow

### Staging Deployment

1. **Build staging version**: `npm run build:staging`
2. **Internal testing**: Team and trusted users
3. **Feedback collection**: Gather and address feedback
4. **Bug fixes**: Fix any issues found in staging

### Production Deployment

1. **Final testing**: Complete testing checklist
2. **Build production**: `npm run build:production`
3. **Store submission**: Submit to app stores
4. **Release monitoring**: Monitor for issues post-release

## 🚨 Emergency Procedures

### Rolling Back Releases

- **Over-the-Air Updates**: Use `eas update` to quickly fix critical issues
- **Store Rollback**: Contact app stores to revert to previous version
- **Hotfix Process**: Deploy critical fixes via OTA updates

### Incident Response

1. **Detect**: Monitor crash reports and user feedback
2. **Assess**: Determine severity and impact
3. **Fix**: Deploy hotfix or rollback as needed
4. **Communicate**: Update users via in-app messaging

## 📞 Support & Troubleshooting

### Common Build Issues

- **Environment variable not found**: Check `.env.local` configuration
- **Apple Developer account required**: iOS builds need paid Apple Developer membership
- **Google Maps API key missing**: Set `GOOGLE_MAPS_API_KEY` environment variable
- **EAS project not configured**: Run `eas init` in project root

### Getting Help

- **EAS Build Issues**: Check [Expo documentation](https://docs.expo.dev/build/introduction/)
- **App Store Submission**: Follow [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- **Play Store Submission**: Follow [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

---

## 🎯 Next Steps for Beta Release

1. **✅ Production Build Configuration** - **COMPLETED**
2. **🔄 Set up crash reporting** (Sentry or Bugsnag)
3. **🔄 Create onboarding flow** for new users
4. **🔄 Add accessibility support**
5. **🔄 Performance testing** on various devices
6. **🔄 Beta tester recruitment** and feedback system

Ready to build your first staging version? Run:

```bash
npm run build:staging
```
