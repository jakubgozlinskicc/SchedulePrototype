import { Confirmation } from "../../../components/Confirmation/Confirmation";
import {
  variantConfig,
  type RegularEventConfirmationProps,
} from "./RegularEventConfirmation.types";

export function RegularEventConfirmation({
  variant,
  onClose,
  onConfirm,
}: RegularEventConfirmationProps) {
  const config = variantConfig[variant];

  return (
    <Confirmation
      variant={variant}
      titleKey={config.titleKey}
      descKey={config.descKey}
      buttons={[
        {
          label: "btn_cancel",
          icon: "fa-solid fa-xmark",
          variant: "secondary",
          onClick: onClose,
        },
        {
          label: config.confirmLabel,
          icon: config.confirmIcon,
          variant: config.confirmButtonVariant,
          onClick: onConfirm,
        },
      ]}
    />
  );
}
