import { useContext } from "react";
import { TranslationContext } from "../contexts/translationContext";

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider"
    );
  }
  return context;
}
