interface StepProgressProps {
  step: 1 | 2;
  label: string;
}

/** Two-segment progress bar + "Étape X sur 2" — from ModalStep1/2.dc.html. */
export function StepProgress({ step, label }: StepProgressProps) {
  return (
    <div role="status">
      <div className="flex items-center gap-2">
        <span className="h-1 flex-1 rounded-full bg-flame" />
        <span className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-flame' : 'bg-[#e7e9ed]'}`} />
      </div>
      <p className="mt-2.5 text-[13px] font-semibold text-muted-soft">{label}</p>
    </div>
  );
}
