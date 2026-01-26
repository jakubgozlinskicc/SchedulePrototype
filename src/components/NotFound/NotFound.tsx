import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  navigateTo: string;
}

export function NotFound({ navigateTo }: NotFoundProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <i className={`fa-solid fa-circle-exclamation ${styles.icon}`}></i>
        <h3 className={styles.title}>{t("error-event-not-found")}</h3>
        <p className={styles.description}>{t("dont-mess-around")}</p>
        <Button variant="primary" onClick={() => navigate(navigateTo)}>
          {t("go-back")}
        </Button>
      </div>
    </div>
  );
}
