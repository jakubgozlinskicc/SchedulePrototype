import { useNavigate } from "react-router-dom";
import styles from "./TopControls.module.css";

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
      <button
        className={styles["overviewButton"]}
        onClick={() => navigate(navigateTo)}
      >
        {buttonText} <i className={buttonIcon}></i>
      </button>
      {children}
    </div>
  );
}
