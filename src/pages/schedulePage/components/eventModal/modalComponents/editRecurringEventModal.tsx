import type { EventModalProps } from "../eventModalTypes";
import { BaseEventModal } from "./BaseEventModal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../../components/Button/Button";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";
import { RecurringEventConfirmation } from "../../../../../events/form/RecurringEventConfirmation/RecurringEventConfirmation";

type EditRecurringEventModalProps = Pick<
  EventModalProps,
  "eventData" | "onClose" | "onSubmit"
> & {
  onRequestDelete: NonNullable<EventModalProps["onRequestDelete"]>;
};

export function EditRecurringEventModal({
  eventData,
  onClose,
  onSubmit,
  onRequestDelete,
}: EditRecurringEventModalProps) {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const [isEditAll, setIsEditAll] = useState<boolean | null>(null);

  const handleConfirmSingle = () => {
    setIsEditAll(false);
    setIsEditModalOpen(false);
  };

  const handleConfirmAll = () => {
    setIsEditAll(true);
    setIsEditModalOpen(false);
  };

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit(data, { isEditAll: isEditAll! });
  };

  const handleClose = () => {
    setIsEditAll(null);
    setIsEditModalOpen(false);
    onClose();
  };
  if (isEditModalOpen) {
    return createPortal(
      <RecurringEventConfirmation
        variant="edit"
        onClose={handleClose}
        onConfirmSingle={handleConfirmSingle}
        onConfirmAll={handleConfirmAll}
      />,
      document.body
    );
  }
  return (
    <>
      <BaseEventModal
        title={t("edit_recurring_title")}
        eventData={eventData}
        onSubmit={handleFormSubmit}
      >
        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <i className="fa-solid fa-trash-can"></i>
          {t("btn_delete")}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
          {t("btn_cancel")}
        </Button>
        <Button type="submit" variant="primary">
          <i className="fa-solid fa-floppy-disk"></i>
          {t("btn_save_changes")}
        </Button>
      </BaseEventModal>

      {isDeleteModalOpen &&
        createPortal(
          <RecurringEventConfirmation
            variant="delete"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirmSingle={() => onRequestDelete({ isDeleteAll: false })}
            onConfirmAll={() => onRequestDelete({ isDeleteAll: true })}
          />,
          document.body
        )}
    </>
  );
}
