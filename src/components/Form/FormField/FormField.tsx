import type { ReactNode } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps {
  children: ReactNode;
}

export function FormField({ children }: FormFieldProps) {
  return <div className={styles.formField}>{children}</div>;
}
