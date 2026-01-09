import { useTranslation } from "react-i18next";
import styles from "./DeleteEventConfirmation.module.css";
import { Button } from "../../../components/Button/Button";

interface DeleteEventConfirmationProps {
  onClose: () => void;
  onConfirmSingle: () => void;
  onConfirmAll: () => void;
}

export function DeleteEventConfirmation({
  onClose,
  onConfirmSingle,
  onConfirmAll,
}: DeleteEventConfirmationProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <i
          className={`fa-solid fa-circle-exclamation ${styles.warningIcon}`}
        ></i>
        <h3>{t("delete-recurring-event-title")}</h3>
        <p className={styles.description}>{t("delete-recurring-event-desc")}</p>

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
            {t("btn_cancel")}
          </Button>
          <Button variant="danger" onClick={onConfirmSingle}>
            <i className="fa-solid fa-calendar-day"></i>
            {t("btn-single")}
          </Button>
          <Button variant="danger" onClick={onConfirmAll}>
            <i className="fa-solid fa-calendar-days"></i>
            {t("btn-all")}
          </Button>
        </div>
      </div>
    </div>
  );
}
