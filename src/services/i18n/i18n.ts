import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

// Import translation files
import en from './translations/en.json';
import es from './translations/es.json';

// Try to import expo-localization with fallback
let Localization: any = null;
try {
  Localization = require('expo-localization');
  console.log('[i18n] expo-localization loaded successfully');
} catch (error) {
  console.warn('[i18n] expo-localization not available, using fallback locale detection');
}

// the translations
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

let isInitialized = false;
const LANGUAGE_STORAGE_KEY = '@compass_language_preference';

const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('[i18n] Error reading stored language preference:', error);
    return null;
  }
};

const storeLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    console.log(`[i18n] Stored language preference: ${language}`);
  } catch (error) {
    console.warn('[i18n] Error storing language preference:', error);
  }
};

const getDeviceLanguage = () => {
  try {
    // First try expo-localization
    if (Localization) {
      const locales = Localization.getLocales();
      console.log('[i18n] Device locales:', locales);
      const primaryLocale = locales[0];
      if (primaryLocale && primaryLocale.languageCode) {
        const lang = primaryLocale.languageCode.toLowerCase();
        console.log('[i18n] Detected device language:', lang);
        return lang === 'es' || lang === 'español' ? 'es' : 'en';
      }
    }
    
    // Fallback to React Native's built-in locale detection
    if (Platform.OS === 'ios') {
      const locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
                    NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
      console.log('[i18n] iOS SettingsManager available:', !!NativeModules.SettingsManager);
      console.log('[i18n] iOS locale detected:', locale);
      if (locale) {
        const lang = locale.split('_')[0].toLowerCase();
        console.log('[i18n] iOS fallback detected language:', lang);
        return lang === 'es' ? 'es' : 'en';
      }
    } else if (Platform.OS === 'android') {
      console.log('[i18n] Android I18nManager available:', !!NativeModules.I18nManager);
      console.log('[i18n] Android I18nManager keys:', Object.keys(NativeModules.I18nManager || {}));
      const locale = NativeModules.I18nManager?.localeIdentifier;
      console.log('[i18n] Android locale detected:', locale);
      
      // TEMPORARY: Force Spanish for testing since locale detection isn't working
      console.log('[i18n] TEMPORARY: Forcing Spanish for testing');
      return 'es';
      
    }
    
    // Web fallback
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      console.log('[i18n] Web fallback detected language:', browserLang);
      return browserLang === 'es' ? 'es' : 'en';
    }
  } catch (error) {
    console.warn('[i18n] Error detecting device language:', error);
  }
  
  console.log('[i18n] Using default language: en');
  return 'en';
};

const initI18n = async () => {
  if (isInitialized) {
    console.log('[i18n] Already initialized, skipping...');
    return i18n;
  }

  // Check for stored language preference first
  const storedLanguage = await getStoredLanguage();
  let lng = storedLanguage || getDeviceLanguage();
  
  // Validate the language
  if (!['en', 'es'].includes(lng)) {
    lng = 'en';
  }
  
  console.log(`[i18n] Initializing with language: ${lng} (${storedLanguage ? 'stored preference' : 'device detection'})`);

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      debug: __DEV__,

      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },

      // Additional configuration
      react: {
        useSuspense: false, // Disable suspense to prevent issues with immediate usage
      },

      // Ensure immediate ready state
      initImmediate: false,
    });

  isInitialized = true;
  console.log(`[i18n] Successfully initialized with language: ${lng}`);
  return i18n;
};

const changeLanguage = async (language: string) => {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(language);
    await storeLanguage(language);
    console.log(`[i18n] Language changed and stored: ${language}`);
  } else {
    console.warn('[i18n] Cannot change language, i18n not initialized yet');
  }
};

// Initialize immediately only if not already done
if (!isInitialized) {
  initI18n().catch(console.error);
}

export default i18n;
export { changeLanguage, getDeviceLanguage, getStoredLanguage, initI18n, storeLanguage };

