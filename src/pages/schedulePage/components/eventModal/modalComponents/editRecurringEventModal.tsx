import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../../../../../db/scheduleDb";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface EditRecurringEventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestDelete: () => void | Promise<void>;
  onEditSingle?: () => void;
  onEditAll?: () => void;
}

export function EditRecurringEventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
  onRequestDelete,
  onEditSingle,
  onEditAll,
}: EditRecurringEventModalProps) {
  const { t } = useTranslation();
  const [showChoice, setShowChoice] = useState(true);

  if (showChoice) {
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3 className="modal-title">{t("modal_recurring_title")}</h3>
          <div className="modal-form">
            <p style={{ marginBottom: "20px" }}>
              {t("modal_recurring_prompt")}
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {t("btn_cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowChoice(false);
                  onEditSingle?.();
                }}
              >
                {t("btn_edit_single")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowChoice(false);
                  onEditAll?.();
                }}
              >
                {t("btn_edit_all")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseEventModal
      title={t("edit")}
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
