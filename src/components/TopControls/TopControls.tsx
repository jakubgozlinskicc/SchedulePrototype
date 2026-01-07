import { useNavigate } from "react-router-dom";
import styles from "./TopControls.module.css";
import { Button } from "../Button/Button";

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
  const navigate = useNavigate();

  return (
    <div className={styles["topControls"]}>
      <Button variant="primary" onClick={() => navigate(navigateTo)}>
        {buttonText} <i className={buttonIcon}></i>
      </Button>
      {children}
    </div>
  );
}
