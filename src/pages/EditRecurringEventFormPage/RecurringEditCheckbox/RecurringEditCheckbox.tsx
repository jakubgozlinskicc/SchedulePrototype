import { useTranslation } from "react-i18next";

interface RecurringEditCheckboxProps {
  isEditAll: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RecurringEditCheckbox({
  isEditAll,
  onChange,
}: RecurringEditCheckboxProps) {
  const { t } = useTranslation();

  return (
    <div className="checkbox">
      <label className="checkbox-label">
        <input type="checkbox" checked={isEditAll} onChange={onChange} />
        <span className="checkbox-text">{t("edit-all-ocurrences")}</span>
      </label>
    </div>
  );
}
