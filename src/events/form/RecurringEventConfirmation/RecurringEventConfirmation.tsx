import { useTranslation } from "react-i18next";
import { Button } from "../../../components/Button/Button";
import styles from "./RecurringEventConfirmation.module.css";
import {
  variantConfig,
  type RecurringEventConfirmationProps,
} from "./RecurringEventConfirmation.types";
import { Modal } from "../../../components/Modal/Modal";

export function RecurringEventConfirmation({
  variant,
  onClose,
  onConfirmSingle,
  onConfirmAll,
}: RecurringEventConfirmationProps) {
  const { t } = useTranslation();
  const config = variantConfig[variant];

  return (
    <Modal className={styles[variant]}>
      <i className={`${config.icon} ${styles.icon}`}></i>

      <h3 className={styles.title}>{t(config.titleKey)}</h3>
      <p className={styles.description}>{t(config.descKey)}</p>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
          {t("btn_cancel")}
        </Button>
        <Button variant={config.buttonVariant} onClick={onConfirmSingle}>
          <i className={config.singleIcon}></i>
          {t("btn-single")}
        </Button>
        <Button variant={config.buttonVariant} onClick={onConfirmAll}>
          <i className={config.allIcon}></i>
          {t("btn-all")}
        </Button>
      </div>
    </Modal>
  );
}
