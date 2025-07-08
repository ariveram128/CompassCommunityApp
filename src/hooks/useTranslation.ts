import { useTranslation as useI18nTranslation } from 'react-i18next';

// Try to import expo-localization with fallback
let Localization: any = null;
try {
  Localization = require('expo-localization');
} catch (error) {
  console.warn('expo-localization not available in useTranslation hook');
}

export const useTranslation = () => {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  
  const changeLanguage = async (lang: string) => {
    try {
      await i18nInstance.changeLanguage(lang);
      // You could also store the preference in SecureStore here if needed
      console.log(`[DEV] Language changed to: ${lang}`);
    } catch (error) {
      console.error('[DEV] Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return i18nInstance.language;
  };

  const getDeviceLanguage = () => {
    if (Localization) {
      return Localization.getLocales()[0]?.languageCode || 'en';
    }
    // Fallback for web or when expo-localization is not available
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.split('-')[0];
    }
    return 'en';
  };

  const isRTL = () => {
    if (Localization) {
      // Check if current locale is RTL based on language tag
      const currentLocale = Localization.getLocales()[0];
      const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
      return currentLocale?.languageCode ? rtlLanguages.includes(currentLocale.languageCode) : false;
    }
    // Fallback RTL detection
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(getCurrentLanguage());
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getDeviceLanguage,
    isRTL,
    // Helper for common translations
    common: {
      ok: t('common.ok'),
      cancel: t('common.cancel'),
      save: t('common.save'),
      delete: t('common.delete'),
      edit: t('common.edit'),
      loading: t('common.loading'),
      error: t('common.error'),
      success: t('common.success'),
      warning: t('common.warning'),
      info: t('common.info')
    }
  };
};

export default useTranslation; 