import { useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage as changeLanguageWithStorage, getDeviceLanguage } from '../services/i18n/i18n';

// Try to import expo-localization with fallback
let Localization: any = null;
try {
  Localization = require('expo-localization');
} catch (error) {
  console.warn('expo-localization not available in useTranslation hook');
}

export const useTranslation = () => {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language);
  
  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      console.log('[useTranslation] Language changed to:', lng);
      setCurrentLanguage(lng);
    };

    i18nInstance.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);
  
  const changeLanguage = async (lang: string) => {
    try {
      console.log(`[useTranslation] Changing language from ${currentLanguage} to ${lang}`);
      await changeLanguageWithStorage(lang);
      setCurrentLanguage(lang);
      console.log(`[useTranslation] Language changed successfully to: ${lang}`);
    } catch (error) {
      console.error('[useTranslation] Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return currentLanguage;
  };

  const getDeviceLanguageFromHook = () => {
    return getDeviceLanguage();
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
    getDeviceLanguage: getDeviceLanguageFromHook,
    isRTL,
    currentLanguage, // Expose current language for components that need to re-render
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