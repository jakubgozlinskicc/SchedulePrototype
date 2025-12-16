import type { EndTypeFieldProps } from "../recurrenceFieldsTypes";
import { useTranslation } from "react-i18next";

export const CountEndField = ({
  onChange,
  recurrenceCount,
}: EndTypeFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="form-field">
      <label id="recurrence-count" className="form-label">
        {t("recurrence-count-label")}
      </label>
      <input
        type="number"
        name="recurrenceCount"
        value={recurrenceCount ?? 10}
        onChange={onChange}
        className="form-input"
        min="1"
        max="365"
      />
    </div>
  );
};
