import { useTranslation } from "react-i18next";
import { useRecurringEdit } from "../../../../../events/useEvents/useEventData/useRecurringEdit/useRecurringEdit";
import { eventRepository } from "../../../../../db/eventRepository";
import { useEventDataContext } from "../../../../../events/useEvents/useEventDataContext/useEventDataContext";

export function RecurringEditCheckbox() {
  const { t } = useTranslation();
  const { handleEditSingle, handleEditAll } = useRecurringEdit(eventRepository);
  const { isEditAll } = useEventDataContext();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      await handleEditAll();
    } else {
      handleEditSingle();
    }
  };

  return (
    <div className="checkbox">
      <label className="checkbox-label">
        <input type="checkbox" checked={isEditAll} onChange={handleChange} />
        <span className="checkbox-text">{t("edit-all-ocurrences")}</span>
      </label>
    </div>
  );
}
