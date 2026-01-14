export type RegularEventConfirmationVariant = "delete";

export interface RegularEventConfirmationProps {
  variant: RegularEventConfirmationVariant;
  onClose: () => void;
  onConfirm: () => void;
}

interface VariantConfig {
  titleKey: string;
  descKey: string;
  confirmButtonVariant: "primary" | "danger";
  confirmLabel: string;
  confirmIcon: string;
}

export const variantConfig: Record<
  RegularEventConfirmationVariant,
  VariantConfig
> = {
  delete: {
    titleKey: "delete-event-title",
    descKey: "delete-event-desc",
    confirmButtonVariant: "danger",
    confirmLabel: "btn_delete",
    confirmIcon: "fa-solid fa-trash-can",
  },
};
