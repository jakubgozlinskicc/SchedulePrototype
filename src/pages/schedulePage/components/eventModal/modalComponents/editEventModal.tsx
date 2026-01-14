import { Button } from "../../../../../components/Button/Button";
import { EVENT_MODAL_FORM_ID, type EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./BaseEventModal";
import { useTranslation } from "react-i18next";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";

type EditEventModalProps = Pick<
  EventModalProps,
  "eventData" | "onClose" | "onSubmit"
> & {
  onRequestDelete: NonNullable<EventModalProps["onRequestDelete"]>;
};

export function EditEventModal({
  eventData,
  onClose,
  onSubmit,
  onRequestDelete,
}: EditEventModalProps) {
  const { t } = useTranslation();

  const handleSubmit = (data: EventFormData) => {
    onSubmit(data, { isEditAll: false });
  };

  return (
    <BaseEventModal
      title={t("edit_title")}
      eventData={eventData}
      onSubmit={handleSubmit}
    >
      <Button type="button" variant="danger" onClick={() => onRequestDelete()}>
        <i className="fa-solid fa-trash-can"></i>
        {t("btn_delete")}
      </Button>
      <Button type="button" variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
        {t("btn_cancel")}
      </Button>
      <Button type="submit" variant="primary" form={EVENT_MODAL_FORM_ID}>
        <i className="fa-solid fa-floppy-disk"></i>
        {t("btn_save_changes")}
      </Button>
    </BaseEventModal>
  );
}
