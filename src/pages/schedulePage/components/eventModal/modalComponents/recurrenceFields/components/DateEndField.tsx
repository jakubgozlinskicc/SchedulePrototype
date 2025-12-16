import type { EndTypeFieldProps } from "../recurrenceFieldsTypes";
import { toDateTimeLocal } from "../../../../../../../utils/toDateTimeLocal/toDateTimeLocal";
import { useTranslation } from "react-i18next";

export const DateEndField = ({
  onChange,
  recurrenceEndDate,
}: EndTypeFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="form-field">
      <label id="recurrence-end-date" className="form-label">
        {t("recurrence-end-date-label")}
      </label>
      <input
        type="date"
        name="recurrenceEndDate"
        value={recurrenceEndDate ? toDateTimeLocal(recurrenceEndDate) : ""}
        onChange={onChange}
        className="form-input"
      />
    </div>
  );
};
