import { useTranslation } from "react-i18next";
import type { EventFormContentProps } from "../eventFormTypes";
import { EventForm } from "./EventForm/EventForm";

export function EditEventForm({ eventId }: EventFormContentProps) {
  const { t } = useTranslation();
  return (
    <EventForm eventId={eventId} title={t("modal_edit_title")}>
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
