import { useTranslation } from "react-i18next";
import { EventForm } from "../EventForm/EventForm";
import { RecurringEditCheckbox } from "./RecurringEditCheckbox/RecurringEditCheckbox";

export function EditRecurringEventForm() {
  const { t } = useTranslation();

  return (
    <EventForm title={t("form_edit_recurring_title")}>
      {({ handleCancel, handleDelete }) => (
        <>
          <RecurringEditCheckbox />
          <button
            type="button"
            className="btn btn-delete"
            onClick={handleDelete}
          >
            {t("btn_delete")}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            {t("btn_cancel")}
          </button>
          <button type="submit" className="btn btn-primary">
            {t("btn_save_changes")}
          </button>
        </>
      )}
    </EventForm>
  );
}
