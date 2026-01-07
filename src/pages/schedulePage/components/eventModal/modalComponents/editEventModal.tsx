import { Button } from "../../../../../components/Button/Button";
import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";

type EditEventModalProps = Pick<
  EventModalProps,
  "eventData" | "isShaking" | "onChange" | "onClose" | "onSubmit"
> & {
  onRequestDelete: NonNullable<EventModalProps["onRequestDelete"]>;
};

export function EditEventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
  onRequestDelete,
}: EditEventModalProps) {
  const { t } = useTranslation();

  return (
    <BaseEventModal
      title={t("edit_title")}
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <Button variant="danger" onClick={onRequestDelete}>
        <i className="fa-solid fa-trash-can"></i>
        {t("btn_delete")}
      </Button>
      <Button variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
        {t("btn_cancel")}
      </Button>
      <Button variant="primary" onClick={onSubmit}>
        <i className="fa-solid fa-floppy-disk"></i>
        {t("btn_save_changes")}
      </Button>
    </BaseEventModal>
  );
}
