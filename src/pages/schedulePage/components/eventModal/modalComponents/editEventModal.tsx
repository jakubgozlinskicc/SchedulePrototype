import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../../../../../db/scheduleDb";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";

interface EditEventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestDelete: () => void | Promise<void>;
}

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
      title={t("modal_edit_title")}
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <button
        type="button"
        className="btn btn-delete"
        onClick={onRequestDelete}
      >
        {t("btn_delete")}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t("btn_cancel")}
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        {t("btn_save_changes")}
      </button>
    </BaseEventModal>
  );
}
