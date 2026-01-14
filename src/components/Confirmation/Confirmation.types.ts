export type ConfirmationVariant = "edit" | "delete";

export interface ConfirmationButton {
  label: string;
  icon?: string;
  variant: "primary" | "secondary" | "danger";
  onClick: () => void;
}

export interface ConfirmationProps {
  variant: ConfirmationVariant;
  titleKey: string;
  descKey: string;
  buttons: ConfirmationButton[];
  icon?: string;
}

export const variantDefaults: Record<ConfirmationVariant, { icon: string }> = {
  edit: { icon: "fa-solid fa-pen-to-square" },
  delete: { icon: "fa-solid fa-circle-exclamation" },
};
