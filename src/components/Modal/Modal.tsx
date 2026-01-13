import type { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  className?: string;
}

export function Modal({ children, className }: ModalProps) {
  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modal} ${className || ""}`}>{children}</div>{" "}
    </div>
  );
}
