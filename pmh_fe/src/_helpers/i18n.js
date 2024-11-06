/** 
 * @file i18next implementation for locale translations
 * This demo uses self domain as backend translation provider, however you could use local files directly or use authApiBase for authorized requests.
 */
 import i18n from "i18next";
 import Backend from "i18next-http-backend";
 import LanguageDetector from 'i18next-browser-languagedetector';
 import { initReactI18next } from "react-i18next";
 
 i18n
     // load translation using http -> see /public/locales
     // learn more: https://github.com/i18next/i18next-http-backend
     .use(Backend)
     // detect user language
     // learn more: https://github.com/i18next/i18next-browser-languageDetector
     .use(LanguageDetector)
     // pass the i18n instance to react-i18next.
     .use(initReactI18next)
     // init i18next
     // for all options read: https://www.i18next.com/overview/configuration-options
     .init({
         lng:"en", // default language override
         fallbackLng: "en",
         debug: import.meta.env.VITE_I18NEXT_DEBUG || false,
         ns: ['common'], // namespaces to load at init
         defaultNS: 'common',
         interpolation: {
             escapeValue: false, // not needed for react as it escapes by default
         },
         backend: {
             // path where resources get loaded from, or a function
             // returning a path:
             // function(lngs, namespaces) { return customPath; }
             // the returned path will interpolate lng, ns if provided like giving a static path
             // the function might return a promise
             //
             // If allowMultiLoading is false, lngs and namespaces will have only one element each,
             // If allowMultiLoading is true, lngs and namespaces can have multiple elements
             loadPath:`${import.meta.env.VITE_PUBLIC_URL === '/' ? '': import.meta.env.VITE_PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
         },
     });
 
 export default i18n;
 