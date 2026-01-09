import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./baseEventModal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "../../../../../components/Button/Button";

type EditRecurringEventModalProps = Pick<
  EventModalProps,
  "eventData" | "onClose" | "onSubmit"
> & {
  onRequestDelete: NonNullable<EventModalProps["onRequestDelete"]>;
  onEditSingle: NonNullable<EventModalProps["onEditSingle"]>;
  onEditAll: NonNullable<EventModalProps["onEditAll"]>;
};

export function EditRecurringEventModal({
  eventData,
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
          <h3 className="modal-title">{t("modal-recurring-title")}</h3>
          <div className="modal-form">
            <p style={{ marginBottom: "20px" }}>
              {t("modal-recurring-prompt")}
            </p>
            <div className="modal-actions">
              <Button type="button" variant="secondary" onClick={onClose}>
                {t("btn_cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setShowChoice(false);
                  onEditSingle();
                }}
              >
                {t("btn-single")}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setShowChoice(false);
                  onEditAll();
                }}
              >
                {t("btn-all")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseEventModal title={t("edit")} eventData={eventData} onSubmit={onSubmit}>
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
