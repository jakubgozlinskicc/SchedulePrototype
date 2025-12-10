import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en/translation.json";
import translationPL from "./pl/translation.json";

const resources = {
  enUS: {
    translation: translationEN,
  },
  pl: {
    translation: translationPL,
  },
};

i18n.use(initReactI18next).init({
  resources,

  lng: "pl",
  fallbackLng: "enUS",

  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
