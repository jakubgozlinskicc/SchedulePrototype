import { Button } from "../../../../../components/Button/Button";
import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";

type AddEventModalProps = Pick<
  EventModalProps,
  "eventData" | "isShaking" | "onChange" | "onClose" | "onSubmit"
>;

export function AddEventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
}: AddEventModalProps) {
  const { t } = useTranslation();

  return (
    <BaseEventModal
      title={t("add_title")}
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <Button variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
        {t("btn_cancel")}
      </Button>
      <Button variant="primary" onClick={onSubmit}>
        <i className="fa-solid fa-calendar-plus"></i>
        {t("btn-add")}
      </Button>
    </BaseEventModal>
  );
}
