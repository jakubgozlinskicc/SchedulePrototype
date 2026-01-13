export type ConfirmationVariant = "edit" | "delete";

export interface RecurringEventConfirmationProps {
  variant: ConfirmationVariant;
  onClose: () => void;
  onConfirmSingle: () => void;
  onConfirmAll: () => void;
}

export const variantConfig = {
  edit: {
    icon: "fa-solid fa-pen-to-square",
    titleKey: "modal-recurring-title",
    descKey: "modal-recurring-prompt",
    buttonVariant: "primary" as const,
    singleIcon: "fa-solid fa-calendar-day",
    allIcon: "fa-solid fa-calendar-days",
  },
  delete: {
    icon: "fa-solid fa-circle-exclamation",
    titleKey: "delete-recurring-event-title",
    descKey: "delete-recurring-event-desc",
    buttonVariant: "danger" as const,
    singleIcon: "fa-solid fa-calendar-day",
    allIcon: "fa-solid fa-calendar-days",
  },
};
