import { useTranslation } from "react-i18next";
import type { EventFormContentProps } from "../eventFormTypes";
import { EventForm } from "./EventForm/EventForm";

export function AddEventForm({ eventId }: EventFormContentProps) {
  const { t } = useTranslation();

  return (
    <EventForm eventId={eventId} title={t("modal_add_title")}>
      {({ handleCancel }) => (
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            {t("btn_cancel")}
          </button>
          <button type="submit" className="btn btn-primary">
            {t("btn-add")}
          </button>
        </>
      )}
    </EventForm>
  );
}
