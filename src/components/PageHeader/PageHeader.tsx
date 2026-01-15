import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  icon?: string;
}

export function PageHeader({ title, icon }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        {icon && <i className={`${icon} ${styles.icon}`}></i>}
        {title}
      </h1>
    </header>
  );
}
