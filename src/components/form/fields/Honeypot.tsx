import styles from './Honeypot.module.css';

interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/** Invisible anti-spam trap (brief §13/§35) — real users never see or fill this. */
export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <label htmlFor="company_website">Ne pas remplir ce champ</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
