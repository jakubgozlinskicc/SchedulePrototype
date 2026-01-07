import type { ReactNode } from "react";
import styles from "./Selector.module.css";

interface SelectorProps {
  currentLanguage: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

export function Selector({
  currentLanguage,
  onChange,
  children,
}: SelectorProps) {
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
