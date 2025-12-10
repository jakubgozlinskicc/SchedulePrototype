import { createContext } from "react";

export type Language = "enUS" | "pl";

export type TranslationContextType = {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
};

export const TranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);
