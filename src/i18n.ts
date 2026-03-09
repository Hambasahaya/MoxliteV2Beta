import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// basic configuration – resources can be extended or loaded via backend later
// for now we keep empty translation objects and rely on dynamic content translation

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "id"],
    resources: {
      en: {
        translation: {
          language: {
            english: "English",
            indonesian: "Bahasa Indonesia",
          },
          buttons: {
            EN: "EN",
            ID: "ID",
          },
        },
      },
      id: {
        translation: {
          language: {
            english: "Inggris",
            indonesian: "Bahasa Indonesia",
          },
          buttons: {
            EN: "EN",
            ID: "ID",
          },
        },
      },
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      // order of detectors; localStorage first so user setting persists
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
