# Contributing to ICE Community Alert

Thank you for your interest in contributing to ICE Community Alert! This project exists to enhance community safety through privacy-first technology.

## 🎯 Our Mission

Provide communities with secure, anonymous tools for sharing time-sensitive safety information while protecting user privacy and maintaining legal compliance.

## 🤝 Ways to Contribute

### 🐛 Bug Reports

- Use GitHub Issues with the "bug" label
- Include device info, OS version, and reproduction steps
- **Never include real location data or personal information**

### ✨ Feature Requests

- Use GitHub Issues with the "enhancement" label
- Focus on community safety and privacy improvements
- Consider impact on user anonymity and security

### 🔒 Security Improvements

- Follow our [Security Policy](SECURITY.md)
- Privacy-focused enhancements are always welcome
- Encryption and anonymization improvements prioritized

### 📚 Documentation

- README updates and clarifications
- Code comments for security-critical functions
- Privacy architecture documentation
- Community safety guidelines

### 🌍 Community Support

- Translation and localization
- Accessibility improvements
- User experience enhancements
- Community outreach and education

## 📋 Development Process

### 1. Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/ice-community-alert.git
cd ice-community-alert

# Install dependencies
npm install
npx expo install

# Start development server
npx expo start
```

### 2. Create Feature Branch

```bash
# Create branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For security improvements
git checkout -b security/vulnerability-fix
```

### 3. Development Guidelines

#### Privacy-First Code Standards

```javascript
// ✅ Good: Anonymized location data
const anonymizedLocation = {
  latitude: Math.round(coords.latitude * 1000) / 1000,
  longitude: Math.round(coords.longitude * 1000) / 1000,
  timestamp: Date.now()
};

// ❌ Bad: Storing exact location with user data
const userLocation = {
  userId: "12345",
  exactLat: coords.latitude,
  exactLng: coords.longitude,
  deviceId: device.uniqueId
};
```

#### Security Requirements

- **No logging of personal data**: Location, device info, or user behavior
- **Encryption for sensitive data**: Use Expo SecureStore for any persistent data
- **Input validation**: Sanitize all user inputs
- **Error handling**: Don't expose system information in error messages

#### Code Quality Standards

- **TypeScript**: Use type annotations for new code
- **Comments**: Document privacy and security decisions
- **Testing**: Add tests for privacy-critical functions
- **Accessibility**: Follow WCAG 2.1 AA guidelines

### 4. Testing Requirements

#### Before Submitting PR

```bash
# Run test suite
npm test

# Test on both platforms
npx expo start --android
npx expo start --ios

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint
```

#### Privacy Testing Checklist

- [ ] No personal data logged to console
- [ ] Location data properly anonymized
- [ ] No persistent user identifiers
- [ ] Auto-expiration working correctly
- [ ] Rate limiting prevents abuse
- [ ] Permissions requested appropriately

### 5. Pull Request Process

#### PR Title Format

```
[TYPE] Brief description

Examples:
[FEATURE] Add anonymous report submission
[FIX] Resolve location permission issue on Android
[SECURITY] Enhance encryption for report data
[PRIVACY] Improve location anonymization algorithm
[DOCS] Update privacy architecture documentation
```

#### PR Description Template

```markdown
## Description
Brief description of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Security improvement
- [ ] Privacy enhancement
- [ ] Documentation update

## Privacy Impact
- [ ] No impact on user privacy
- [ ] Enhances user privacy
- [ ] Changes data collection (explain below)
- [ ] Affects location handling (explain below)

## Testing
- [ ] Tested on Android
- [ ] Tested on iOS
- [ ] Tested privacy features
- [ ] Added/updated tests
- [ ] Manual testing completed

## Security Checklist
- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Error handling doesn't leak data
- [ ] Privacy-compliant logging
- [ ] Encryption used where appropriate

## Screenshots (if applicable)
```

### 6. Code Review Process

#### Review Criteria

1. **Privacy Protection**: Does code maintain user anonymity?
2. **Security**: Are there any security vulnerabilities?
3. **Functionality**: Does it work as intended?
4. **Code Quality**: Is it maintainable and well-documented?
5. **Performance**: Does it impact battery or data usage?

#### Required Approvals

- **Security changes**: 2 approvals from security team
- **Privacy features**: 1 approval from privacy lead
- **General features**: 1 approval from core team
- **Documentation**: 1 approval from any maintainer

## 🔒 Security & Privacy Requirements

### Mandatory Privacy Protections

- **No user tracking**: Technical impossibility of user identification
- **Location anonymization**: Always fuzz GPS coordinates
- **Data minimization**: Collect only essential information
- **Auto-expiration**: All user data must have expiration
- **Local-first**: Minimize server dependencies

### Security Standards

- **Encryption**: Use AES-256 for any sensitive data
- **Secure storage**: Expo SecureStore for local data
- **Input validation**: Sanitize all user inputs
- **Error handling**: Don't expose system information
- **Dependencies**: Keep all packages updated

### Prohibited Practices

- ❌ Collecting or storing personal identifiers
- ❌ Exact location tracking or storage
- ❌ User behavior analytics or tracking
- ❌ Third-party analytics or advertising SDKs
- ❌ Persistent user sessions or accounts
- ❌ Sharing data with external services

## 🌍 Community Guidelines

### Inclusive Development

- **Accessibility**: Design for users with disabilities
- **Internationalization**: Support multiple languages
- **Cultural sensitivity**: Respect diverse communities
- **Device compatibility**: Support older and budget devices

### Community Safety Focus

- **User safety**: Prioritize user protection in all decisions
- **Legal compliance**: Ensure local law compatibility
- **Community benefit**: Features should serve community needs
- **Harm prevention**: Consider potential misuse and mitigation

## 📞 Getting Help

### Development Questions

- **GitHub Discussions**: General development questions
- **Issues**: Bug reports and feature requests
- **Documentation**: Check README and docs/ folder

### Security & Privacy

- **Email**: <security@community-alert.org>
- **Response time**: 24-48 hours for non-critical issues
- **Urgent issues**: Follow Security Policy guidelines

### Community Support

- **Discord**: Join our community channel (link in README)
- **Matrix**: Privacy-focused chat option
- **Email**: <community@community-alert.org>

## 🎉 Recognition

### Contributor Types

- **Code Contributors**: GitHub commits and PRs
- **Security Researchers**: Vulnerability reports and fixes
- **Privacy Advocates**: Privacy feature suggestions and testing
- **Community Members**: Documentation, translation, outreach
- **Accessibility Experts**: Inclusive design improvements

### Hall of Fame

Contributors who make significant improvements to community safety, privacy, or security will be recognized in our Hall of Fame.

---

**By contributing, you agree to prioritize user privacy, community safety, and legal compliance in all contributions.**

**Thank you for helping make communities safer! 🛡️**
