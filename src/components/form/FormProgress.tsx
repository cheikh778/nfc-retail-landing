import styles from './FormProgress.module.css';

interface FormProgressProps {
  step: 1 | 2;
  label: string;
}

export function FormProgress({ step, label }: FormProgressProps) {
  return (
    <div className={styles.progress} role="status">
      <div className={styles.track}>
        <span className={styles.segment} data-filled="true" />
        <span className={styles.segment} data-filled={step >= 2 ? 'true' : 'false'} />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
