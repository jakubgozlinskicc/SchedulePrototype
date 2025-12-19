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
      title={t("modal_add_title")}
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t("btn_cancel")}
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        {t("btn-add")}
      </button>
    </BaseEventModal>
  );
}
