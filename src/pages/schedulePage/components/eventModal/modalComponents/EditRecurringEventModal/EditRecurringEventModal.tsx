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
import { Confirmation } from "../../../../../../components/Confirmation/Confirmation";

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
      <Confirmation
        variant="edit"
        titleKey="modal-recurring-title"
        descKey="modal-recurring-prompt"
        buttons={[
          {
            label: "btn_cancel",
            icon: "fa-solid fa-xmark",
            variant: "secondary",
            onClick: onClose,
          },
          {
            label: "btn-single",
            icon: "fa-solid fa-calendar-day",
            variant: "primary",
            onClick: confirmSingle,
          },
          {
            label: "btn-all",
            icon: "fa-solid fa-calendar-days",
            variant: "primary",
            onClick: confirmAll,
          },
        ]}
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
          <i className="fa-solid fa-trash-can"></i>
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
          <Confirmation
            variant="delete"
            titleKey="modal-recurring-title"
            descKey="modal-recurring-prompt"
            buttons={[
              {
                label: "btn_cancel",
                icon: "fa-solid fa-xmark",
                variant: "secondary",
                onClick: closeDeleteModal,
              },
              {
                label: "btn-single",
                icon: "fa-solid fa-calendar-day",
                variant: "danger",
                onClick: () => onRequestDelete({ isDeleteAll: false }),
              },
              {
                label: "btn-all",
                icon: "fa-solid fa-calendar-days",
                variant: "danger",
                onClick: () => onRequestDelete({ isDeleteAll: true }),
              },
            ]}
          />,
          document.body
        )}
    </>
  );
}
