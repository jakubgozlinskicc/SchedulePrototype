import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { TranslationContext, type Language } from "./translationContext";

type TranslationProviderProps = {
  children: ReactNode;
};

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("pl");

  const { i18n: translator } = useTranslation();

  const changeLanguage = (language: Language) => {
    translator.changeLanguage(language);
    setCurrentLanguage(language);
  };

  const value = {
    currentLanguage,
    changeLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}
