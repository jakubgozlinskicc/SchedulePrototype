import type { ReactNode } from "react";
import styles from "./FormLabel.module.css";

interface FormLabelProps {
  children: ReactNode;
}
export function FormLabel({
  children,
  ...rest
}: FormLabelProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={styles.formLabel} {...rest}>
      {children}
    </label>
  );
}
