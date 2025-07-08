import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../src/hooks/useTranslation';

export default function SettingsScreen() {
  const { t, changeLanguage, getCurrentLanguage } = useTranslation();
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = async (lang: string) => {
    if (lang !== currentLanguage) {
      await changeLanguage(lang);
      // Force a re-render by updating state or using a different method
      // The component will automatically re-render when language changes
    }
  };

  const showTutorial = () => {
    Alert.alert(
      t('settings.support.tutorial'),
      t('settings.tutorialInfo'),
      [{ text: t('common.ok') }]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      t('settings.clearDataTitle'),
      t('settings.clearDataMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('settings.clearDataConfirm'), 
          style: 'destructive',
          onPress: () => {
            // Clear data logic here
            Alert.alert(t('common.success'), t('settings.dataCleared'));
          }
        }
      ]
    );
  };

  const resetOnboarding = () => {
    Alert.alert(
      t('settings.developer.resetOnboarding'),
      t('settings.resetOnboardingMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('settings.resetOnboardingConfirm'), 
          onPress: () => {
            // Reset onboarding logic here
            Alert.alert(t('common.success'), t('settings.onboardingReset'));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="language" size={24} color="#6366F1" />
            <Text style={styles.cardTitle}>{t('settings.language.title')}</Text>
          </View>
          <Text style={styles.cardSubtitle}>{t('settings.language.subtitle')}</Text>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en' && styles.languageButtonActive
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'en' && styles.languageButtonTextActive
              ]}>
                {t('settings.language.english')}
              </Text>
              {currentLanguage === 'en' && (
                <Ionicons name="checkmark" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'es' && styles.languageButtonActive
              ]}
              onPress={() => handleLanguageChange('es')}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'es' && styles.languageButtonTextActive
              ]}>
                {t('settings.language.spanish')}
              </Text>
              {currentLanguage === 'es' && (
                <Ionicons name="checkmark" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.cardTitle}>{t('settings.privacy.title')}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.privacy.location')}</Text>
              <Text style={styles.settingSubtitle}>{t('settings.privacy.locationSubtitle')}</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={locationEnabled ? '#ffffff' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.privacy.notifications')}</Text>
              <Text style={styles.settingSubtitle}>{t('settings.privacy.notificationsSubtitle')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#9CA3AF'}
            />
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={clearAllData}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.privacy.dataStorage')}</Text>
              <Text style={styles.settingSubtitle}>{t('settings.privacy.dataStorageSubtitle')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Community Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>{t('settings.community.title')}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.community.verification')}</Text>
              <Text style={styles.settingSubtitle}>{t('settings.community.verificationSubtitle')}</Text>
            </View>
            <Switch
              value={verificationEnabled}
              onValueChange={setVerificationEnabled}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={verificationEnabled ? '#ffffff' : '#9CA3AF'}
            />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.community.alertRadius')}</Text>
              <Text style={styles.settingSubtitle}>{t('settings.community.alertRadiusSubtitle')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Legal & Privacy */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color="#6366F1" />
            <Text style={styles.cardTitle}>{t('settings.legal.title')}</Text>
          </View>
          
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/legal')}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.legal.privacyPolicy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/legal')}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.legal.termsOfService')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.legal.openSource')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Support & Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="help-circle" size={24} color="#8B5CF6" />
            <Text style={styles.cardTitle}>{t('settings.support.title')}</Text>
          </View>
          
          <TouchableOpacity style={styles.settingRow} onPress={showTutorial}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.support.tutorial')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.support.guidelines')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.support.contact')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Developer Options */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="code-working" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>{t('settings.developer.title')}</Text>
          </View>
          
          <TouchableOpacity style={styles.settingRow} onPress={showTutorial}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.developer.showOnboarding')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={resetOnboarding}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.developer.resetOnboarding')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={clearAllData}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('settings.developer.clearData')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>{t('settings.about.title')}</Text>
          </View>
          <Text style={styles.aboutText}>
            {t('settings.about.description')}
          </Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>{t('settings.about.version', { version: '0.1.0' })}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: 'rgba(30, 30, 66, 0.8)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.8)',
  },
  languageButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginRight: 8,
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  aboutText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
}); 