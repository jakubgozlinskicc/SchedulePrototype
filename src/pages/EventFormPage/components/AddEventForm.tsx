import { useTranslation } from "react-i18next";
import { EventForm } from "./EventForm/EventForm";

export function AddEventForm() {
  const { t } = useTranslation();

  return (
    <EventForm title={t("modal_add_title")}>
      {({ handleCancel }) => (
        <>
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
              className="fa-solid fa-calendar-plus"
              style={{ marginRight: "8px" }}
            ></i>
            {t("btn-add")}
          </button>
        </>
      )}
    </EventForm>
  );
}
