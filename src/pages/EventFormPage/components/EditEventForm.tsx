import { useTranslation } from "react-i18next";
import { EventForm } from "./EventForm/EventForm";
import { Button } from "../../../components/Button/Button";

export function EditEventForm() {
  const { t } = useTranslation();

  return (
    <EventForm title={t("modal_edit_title")}>
      {({ handleCancel, handleDelete }) => (
        <>
          <Button variant="danger" onClick={handleDelete}>
            <i className="fa-solid fa-trash-can"></i>
            {t("btn_delete")}
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            <i className="fa-solid fa-xmark"></i>
            {t("btn_cancel")}
          </Button>
          <Button variant="primary">
            <i
              className="fa-solid fa-floppy-disk"
              style={{ marginRight: "8px" }}
            ></i>
            {t("btn_save_changes")}
          </Button>
        </>
      )}
    </EventForm>
  );
}
