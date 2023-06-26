import i18n, {ModuleType} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import english from './locales/en.json';
import german from './locales/de.json';
import bulgarian from './locales/bg.json';

export const USER_PREFERRED_LANGUAGE = RNLocalize.getLocales()[0].languageCode;

const MODULE_TYPE: ModuleType = 'languageDetector';

const LANGUAGE_DETECTOR = {
  async: true,
  cacheUserLanguage: () => {},
  detect: (cb: (code: string) => void) => {
    return cb(USER_PREFERRED_LANGUAGE);
  },
  init: () => {},
  type: MODULE_TYPE,
};

const RESOURCES = {
  en: english,
  de: german,
  bg: bulgarian,
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // TODO: consider configuring pluralization instead of using compatibilityJSON
    // https://stackoverflow.com/questions/70493788/i18nextpluralresolver-your-environment-seems-not-to-be-intl-api-compatible-u
    compatibilityJSON: 'v3',
    resources: RESOURCES,
    // language to use if translations in user language are not available
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  });

export default i18n;
