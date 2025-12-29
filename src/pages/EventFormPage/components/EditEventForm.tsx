import { useTranslation } from "react-i18next";
import { EventForm } from "./EventForm/EventForm";

export function EditEventForm() {
  const { t } = useTranslation();

  return (
    <EventForm title={t("modal_edit_title")}>
      {({ handleCancel, handleDelete }) => (
        <>
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
