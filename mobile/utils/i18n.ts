import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import hi from '../locales/hi.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const savedDataJSON = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
            const lng = savedDataJSON ? savedDataJSON : 'en';
            callback(lng);
        } catch (error) {
            console.log('Error reading language', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, lng);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            en,
            hi,
        },
        defaultNS: 'common',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

export default i18n;
