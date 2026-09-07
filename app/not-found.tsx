import { PATHS } from '@/lib/paths';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-display text-3xl font-bold text-navy">Page introuvable</h1>
      <p className="text-muted">Cette page n’existe pas ou a été déplacée.</p>
      <a
        href={PATHS.visibilite}
        className="rounded-full bg-flame px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
      >
        Retour à l’accueil
      </a>
    </main>
  );
}
