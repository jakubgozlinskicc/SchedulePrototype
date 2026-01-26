export type RecurringEventConfirmationVariant = "edit" | "delete";

export interface RecurringEventConfirmationProps {
  variant: RecurringEventConfirmationVariant;
  onClose: () => void;
  onConfirmSingle: () => void;
  onConfirmAll: () => void;
}

export const variantConfig = {
  edit: {
    titleKey: "modal-recurring-title",
    descKey: "modal-recurring-prompt",
    buttonVariant: "primary" as const,
  },
  delete: {
    titleKey: "delete-recurring-event-title",
    descKey: "delete-recurring-event-desc",
    buttonVariant: "danger" as const,
  },
};
