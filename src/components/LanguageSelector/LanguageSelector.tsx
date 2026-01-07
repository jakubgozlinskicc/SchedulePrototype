import type { ReactNode } from "react";
import styles from "./LanguageSelector.module.css";

interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

export function LanguageSelector({
  currentLanguage,
  onChange,
  children,
}: LanguageSelectorProps) {
  return (
    <select
      className={styles.languageSelector}
      value={currentLanguage}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
