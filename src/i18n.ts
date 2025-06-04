import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/app/translation/ar.json";
import en from "@/app/translation/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en", // اللغة الافتراضية
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
