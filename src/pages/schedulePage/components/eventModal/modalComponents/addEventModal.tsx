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
        <i className="fa-solid fa-xmark" style={{ marginRight: "8px" }}></i>
        {t("btn_cancel")}
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        <i
          className="fa-solid fa-calendar-plus"
          style={{ marginRight: "8px" }}
        ></i>
        {t("btn-add")}
      </button>
    </BaseEventModal>
  );
}
