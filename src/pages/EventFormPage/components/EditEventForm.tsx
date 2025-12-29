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
