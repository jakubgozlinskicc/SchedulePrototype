import { Button } from "../../../../../components/Button/Button";
import { EVENT_MODAL_FORM_ID, type EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./BaseEventModal";
import { useTranslation } from "react-i18next";

type AddEventModalProps = Pick<
  EventModalProps,
  "eventData" | "onClose" | "onSubmit"
>;

export function AddEventModal({
  eventData,
  onClose,
  onSubmit,
}: AddEventModalProps) {
  const { t } = useTranslation();

  return (
    <BaseEventModal
      title={t("add_title")}
      eventData={eventData}
      onSubmit={onSubmit}
    >
      <Button type="button" variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
        {t("btn_cancel")}
      </Button>
      <Button type="submit" variant="primary" form={EVENT_MODAL_FORM_ID}>
        <i className="fa-regular fa-calendar-plus"></i>
        {t("btn-add")}
      </Button>
    </BaseEventModal>
  );
}
