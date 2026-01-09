import { Button } from "../../../../../components/Button/Button";
import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";

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

  return (
    <BaseEventModal
      title={t("edit_title")}
      eventData={eventData}
      onSubmit={onSubmit}
    >
      <Button type="button" variant="danger" onClick={onRequestDelete}>
        <i className="fa-solid fa-trash-can"></i>
        {t("btn_delete")}
      </Button>
      <Button type="button" variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
        {t("btn_cancel")}
      </Button>
      <Button type="submit" variant="primary">
        <i className="fa-solid fa-floppy-disk"></i>
        {t("btn_save_changes")}
      </Button>
    </BaseEventModal>
  );
}
