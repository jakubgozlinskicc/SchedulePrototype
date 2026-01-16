import {
  EVENT_MODAL_FORM_ID,
  type EventModalProps,
} from "../../eventModalTypes";
import { BaseEventModal } from "../BaseEventModal";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { Button } from "../../../../../../components/Button/Button";
import type { EventFormData } from "../../../../../../events/form/EventForm/eventFormSchema";
import { useRecurringEventEdit } from "./useRecurringEventEdit/useRecurringEventEdit";
import { RecurringEventConfirmation } from "../../../../../../events/Confirmations/RecurringEventConfirmation/RecurringEventConfirmation";

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

  const {
    isEditModalOpen,
    isDeleteModalOpen,
    isEditAll,
    confirmSingle,
    confirmAll,
    handleClose,
    openDeleteModal,
    closeDeleteModal,
  } = useRecurringEventEdit(onClose);

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit(data, { isEditAll: isEditAll! });
  };

  if (isEditModalOpen) {
    return createPortal(
      <RecurringEventConfirmation
        variant="edit"
        onClose={onClose}
        onConfirmSingle={confirmSingle}
        onConfirmAll={confirmAll}
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
        isEditAll={isEditAll}
      >
        <Button
          type="button"
          variant="danger"
          onClick={() => openDeleteModal()}
        >
          <i className="fa-regular fa-trash-can"></i>
          {t("btn_delete")}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
          {t("btn_cancel")}
        </Button>
        <Button type="submit" variant="primary" form={EVENT_MODAL_FORM_ID}>
          <i className="fa-solid fa-floppy-disk"></i>
          {t("btn_save_changes")}
        </Button>
      </BaseEventModal>

      {isDeleteModalOpen &&
        createPortal(
          <RecurringEventConfirmation
            variant="delete"
            onClose={closeDeleteModal}
            onConfirmSingle={() => onRequestDelete({ isDeleteAll: false })}
            onConfirmAll={() => onRequestDelete({ isDeleteAll: true })}
          />,
          document.body
        )}
    </>
  );
}
