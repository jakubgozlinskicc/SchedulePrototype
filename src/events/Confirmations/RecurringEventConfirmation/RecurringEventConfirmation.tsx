import { Confirmation } from "../../../components/Confirmation/Confirmation";
import {
  variantConfig,
  type RecurringEventConfirmationProps,
} from "./RecurringEventConfirmation.types";

export function RecurringEventConfirmation({
  variant,
  onClose,
  onConfirmSingle,
  onConfirmAll,
}: RecurringEventConfirmationProps) {
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
          label: "btn-single",
          icon: "fa-solid fa-calendar-day",
          variant: config.buttonVariant,
          onClick: onConfirmSingle,
        },
        {
          label: "btn-all",
          icon: "fa-solid fa-calendar-days",
          variant: config.buttonVariant,
          onClick: onConfirmAll,
        },
      ]}
    />
  );
}
