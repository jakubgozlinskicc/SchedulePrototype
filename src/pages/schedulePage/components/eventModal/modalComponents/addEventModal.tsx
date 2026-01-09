import { Button } from "../../../../../components/Button/Button";
import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./baseEventModal";
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
      <Button type="submit" variant="primary">
        <i className="fa-solid fa-calendar-plus"></i>
        {t("btn-add")}
      </Button>
    </BaseEventModal>
  );
}
