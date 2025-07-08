import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './translations/en.json';
import es from './translations/es.json';

// Try to import expo-localization with fallback
let Localization: any = null;
try {
  Localization = require('expo-localization');
} catch (error) {
  console.warn('expo-localization not available, using fallback locale detection');
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

const initI18n = async () => {
  let lng = 'en'; // default language
  
  try {
    if (Localization) {
      // Get device language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
      lng = deviceLanguage === 'es' ? 'es' : 'en'; // Only support en/es for now
    } else {
      // Fallback for web or when expo-localization is not available
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.split('-')[0];
        lng = browserLang === 'es' ? 'es' : 'en';
      }
    }
  } catch (error) {
    console.warn('Could not detect device language, using English as default:', error);
    lng = 'en';
  }

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

  console.log(`[i18n] Initialized with language: ${lng}`);
  return i18n;
};

// Initialize immediately
initI18n().catch(console.error);

export default i18n;
export { initI18n };
