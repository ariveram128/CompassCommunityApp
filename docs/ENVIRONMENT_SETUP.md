# Environment Setup Guide

## 🔐 Secure Configuration for Compass Community App

This guide walks you through setting up environment variables and API keys securely for the Compass Community app.

## 📋 Prerequisites

- Node.js 18+ with npm
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
- Google Cloud Platform account (for Maps API)
- Git configured with your credentials

## 🔑 API Keys Required

### 1. Google Maps API Key

**Required for**: Interactive maps, location services, route calculation

**How to get it**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Maps SDK for Android** API
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy your API key

**Security recommendations**:

- Restrict the API key to your Android app's package name
- Set billing alerts to prevent unexpected charges
- Never commit the key to version control

## 🛠️ Local Development Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/compass-community.git
cd CompassCommunityApp
npm install
```

### Step 2: Create Environment File

Create a `.env.local` file in the project root:

```bash
# .env.local (this file is gitignored for security)

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Optional: Add other local development variables here
# DEBUG_MODE=true
# LOG_LEVEL=verbose
```

### Step 3: Verify Gitignore Protection

Ensure these patterns are in your `.gitignore`:

```gitignore
# Environment files (already included)
.env*.local
.env
.env.development  
.env.production
```

## ☁️ EAS Build Configuration

### Step 1: Login to EAS

```bash
npx eas login
```

### Step 2: Set Environment Variables for Builds

```bash
# Development environment
npx eas env:create --name GOOGLE_MAPS_API_KEY --value your-api-key-here --environment development

# Production environment  
npx eas env:create --name GOOGLE_MAPS_API_KEY --value your-api-key-here --environment production
```

**When prompted for visibility, choose**:

- **Sensitive** for API keys (recommended)
- **Plain text** for non-sensitive config

### Step 3: Verify Environment Variables

```bash
# List all environment variables
npx eas env:list

# Check specific environment
npx eas env:list --environment development
```

## 🏗️ Build Process

### Development Build

```bash
# Configure EAS (first time only)
npx eas build:configure

# Create development build
npx eas build --platform android --profile development

# For iOS (requires Apple Developer account)
npx eas build --platform ios --profile development
```

### Production Build

```bash
# Build for app stores
npx eas build --platform all --profile production
```

## 🔍 Troubleshooting

### Common Issues

#### "Invalid UUID appId" Error

- **Cause**: EAS can't parse the project ID from app.json
- **Solution**: The project ID should be a valid UUID in app.json (not an environment variable)

#### "API key not found" Error

- **Cause**: Environment variable not set or not loaded
- **Solutions**:
  1. Verify `.env.local` file exists and has correct key name
  2. Check EAS environment variables: `npx eas env:list`
  3. Rebuild the app after adding environment variables

#### Maps not loading

- **Cause**: API key restrictions or billing issues
- **Solutions**:
  1. Check Google Cloud Console for API usage
  2. Verify API key restrictions allow your app
  3. Ensure billing is enabled on Google Cloud project

## 🔒 Security Best Practices

### ✅ DO

- Use `.env.local` for local development (gitignored)
- Use EAS environment variables for builds
- Restrict Google Maps API key to your app package
- Set up billing alerts on Google Cloud
- Regularly rotate API keys

### ❌ DON'T

- Commit API keys to version control
- Share environment files publicly
- Use unrestricted API keys
- Store sensitive data in app.json
- Use production keys for development

## 📁 File Structure

```
CompassCommunityApp/
├── .env.local              # Local environment (gitignored)
├── .env.local.example      # Template for setup
├── .gitignore              # Includes environment file patterns
├── app.json                # Public config (project ID safe here)
├── eas.json                # EAS build configuration
└── docs/
    └── ENVIRONMENT_SETUP.md # This guide
```

## 🔄 Environment Variable Reference

| Variable | Used For | Local (.env.local) | EAS (eas env) | Required |
|----------|----------|-------------------|---------------|----------|
| `GOOGLE_MAPS_API_KEY` | Maps, geolocation | ✅ | ✅ | Yes |
| `EAS_PROJECT_ID` | Build identification | ❌ | ❌ | No (in app.json) |

## 🆘 Getting Help

### If you're stuck

1. **Check environment variables**: `npx eas env:list`
2. **Verify API key**: Test in Google Cloud Console
3. **Clear cache**: `npx expo start --clear`
4. **Rebuild app**: Create new development build
5. **Check logs**: Look for API-related errors in Expo logs

### Common Commands

```bash
# Development
npx expo start --dev-client

# Clear cache and restart
npx expo start --clear

# Build new development version
npx eas build --platform android --profile development

# Check environment
npx eas env:list --environment development
```

## 📞 Support

- **GitHub Issues**: Technical problems
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Google Maps API**: [developers.google.com/maps](https://developers.google.com/maps)

---

**Remember**: Never commit API keys or sensitive configuration to version control. The security of the community depends on protecting these credentials.
