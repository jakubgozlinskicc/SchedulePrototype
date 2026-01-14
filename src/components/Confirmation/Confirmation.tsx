import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import styles from "./Confirmation.module.css";
import { variantDefaults, type ConfirmationProps } from "./Confirmation.types";

export function Confirmation({
  variant,
  titleKey,
  descKey,
  buttons,
  icon,
}: ConfirmationProps) {
  const { t } = useTranslation();
  const iconClass = icon ?? variantDefaults[variant].icon;

  return (
    <Modal className={styles[variant]}>
      <i className={`${iconClass} ${styles.icon}`}></i>
      <h3 className={styles.title}>{t(titleKey)}</h3>
      <p className={styles.description}>{t(descKey)}</p>

      <div className={styles.actions}>
        {buttons.map((btn, index) => (
          <Button key={index} variant={btn.variant} onClick={btn.onClick}>
            {btn.icon && <i className={btn.icon}></i>}
            {t(btn.label)}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
