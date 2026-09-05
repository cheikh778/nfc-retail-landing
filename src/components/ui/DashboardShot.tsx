interface DashboardShotProps {
  src: string;
  alt: string;
}

/** Real product screenshot, framed in a browser-chrome card — used in the Hero. */
export function DashboardShot({ src, alt }: DashboardShotProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-navy shadow-card">
      <div className="flex items-center gap-2 border-b border-primary-foreground/10 bg-navy px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-flame/80" />
        <span className="ml-3 hidden rounded-md bg-primary-foreground/10 px-2.5 py-1 text-[10px] font-medium text-primary-foreground/70 sm:block">
          app.nfcretail.com — tableau de bord
        </span>
      </div>
      <img src={src} alt={alt} width={1000} height={711} loading="eager" className="block w-full" />
    </div>
  );
}
