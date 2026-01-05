import styles from "./LanguageSelect.module.css";

interface LanguageSelectProps {
  currentLanguage: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function LanguageSelect({
  currentLanguage,
  onChange,
}: LanguageSelectProps) {
  return (
    <select
      className={styles.languageSelect}
      value={currentLanguage}
      onChange={onChange}
    >
      <option value="enUS">EN</option>
      <option value="pl">PL</option>
    </select>
  );
}
