import styles from "./ColorLoader.module.css";

interface PaintSplashProps {
  color: string;
  trigger: number;
}

export function ColorLoader({ color, trigger }: PaintSplashProps) {
  if (trigger === 0) return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.slider}
        key={trigger}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
