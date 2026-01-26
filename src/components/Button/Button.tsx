import { forwardRef } from "react";
import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.css";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isActive = false,
      children,
      className = "",
      ...rest
    },
    ref
  ) => {
    const buttonClass = [
      styles.button,
      styles[variant],
      isActive && styles.active,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={buttonClass} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
