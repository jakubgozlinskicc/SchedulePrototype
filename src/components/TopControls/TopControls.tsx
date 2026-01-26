import { useNavigate } from "react-router-dom";
import styles from "./TopControls.module.css";
import { Button } from "../Button/Button";
import { useTranslation } from "react-i18next";

interface TopControlsProps {
  buttonText: string;
  buttonIcon: string;
  navigateTo: string;
  children?: React.ReactNode;
}

export function TopControls({
  buttonText,
  buttonIcon,
  navigateTo,
  children,
}: TopControlsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.topControls}>
      <Button variant="primary" onClick={() => navigate(navigateTo)}>
        <i className={buttonIcon}></i> {t(buttonText)}
      </Button>
      {children}
    </div>
  );
}
