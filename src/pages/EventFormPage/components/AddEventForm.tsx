import { useTranslation } from "react-i18next";
import { EventForm } from "./EventForm/EventForm";
import { Button } from "../../../components/Button/Button";

export function AddEventForm() {
  const { t } = useTranslation();

  return (
    <EventForm title={t("add_title")}>
      {({ handleCancel }) => (
        <>
          <Button variant="secondary" onClick={handleCancel}>
            <i className="fa-solid fa-xmark"></i>
            {t("btn_cancel")}
          </Button>
          <Button variant="primary" onClick={handleCancel}>
            <i className="fa-solid fa-calendar-plus"></i>
            {t("btn-add")}
          </Button>
        </>
      )}
    </EventForm>
  );
}
