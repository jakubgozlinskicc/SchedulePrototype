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
            <i
              className="fa-solid fa-trash-can"
              style={{ marginRight: "8px" }}
            ></i>
            {t("btn_delete")}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-xmark" style={{ marginRight: "8px" }}></i>
            {t("btn_cancel")}
          </button>
          <button type="submit" className="btn btn-primary">
            <i
              className="fa-solid fa-floppy-disk"
              style={{ marginRight: "8px" }}
            ></i>
            {t("btn_save_changes")}
          </button>
        </>
      )}
    </EventForm>
  );
}
