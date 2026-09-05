import { ArrowUpRight, Calendar, Eye, MapPin, MessageSquare, Star, Target, Users } from 'lucide-react';

const bars = [34, 42, 38, 52, 48, 60, 57, 68, 74, 70, 82, 90];

const reviews = [
  { name: 'Sophie M.', text: 'Accueil impeccable, je recommande vivement.', time: 'il y a 2 h' },
  { name: 'Karim B.', text: 'Très bon service, rapide et efficace.', time: 'il y a 5 h' },
];

/** Fully coded, data-free dashboard mockup — no dependency on a real product screenshot. */
export function DashboardMockup() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card"
      role="img"
      aria-label="Aperçu du tableau de bord NFC Retail avec des données de démonstration"
    >
      <div className="flex items-center gap-2 border-b border-border bg-cream px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-flame/70" />
        <span className="ml-3 hidden rounded-md bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground sm:block">
          app.nfc-retail.fr — démonstration
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1 overflow-hidden" aria-hidden>
          {["Vue d'ensemble", 'Réputation', 'Acquisition'].map((tab, i) => (
            <span
              key={tab}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-600 ${
                i === 0 ? 'bg-navy/5 text-navy' : 'text-muted-foreground'
              } ${i > 0 ? 'hidden sm:inline-block' : ''}`}
            >
              {tab}
            </span>
          ))}
        </div>
        <span
          aria-hidden
          className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-600 text-muted-foreground sm:inline-flex"
        >
          <Calendar className="h-3 w-3" aria-hidden />
          30 derniers jours
        </span>
      </div>

      <div className="grid gap-3 p-3.5 sm:grid-cols-3 sm:gap-4 sm:p-5">
        <div className="rounded-xl border border-border bg-cream p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Score de visibilité
            </p>
            <Eye className="h-3.5 w-3.5 text-flame" aria-hidden />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-4xl font-700 leading-none text-navy">78</span>
            <span className="pb-0.5 text-xs font-medium text-muted-foreground">/ 100</span>
            <span className="mb-0.5 ml-auto inline-flex items-center gap-0.5 rounded-md bg-flame-soft px-1.5 py-0.5 text-[10px] font-700 text-flame">
              <ArrowUpRight className="h-3 w-3" aria-hidden />
              +12
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[78%] rounded-full bg-flame" />
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Évolution de la visibilité
            </p>
            <span className="text-[10px] font-medium text-muted-foreground">12 derniers mois</span>
          </div>
          <div className="mt-4 flex h-20 items-end gap-1.5 sm:h-24" aria-hidden>
            {bars.map((height, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t-sm ${
                  i === bars.length - 1 ? 'bg-flame' : i >= bars.length - 3 ? 'bg-flame/50' : 'bg-navy/15'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Avis clients
            </p>
            <MessageSquare className="h-3.5 w-3.5 text-flame" aria-hidden />
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="font-display text-2xl font-700 text-navy">4,7</span>
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'fill-flame text-flame' : 'fill-flame/30 text-flame/30'}`} />
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-2.5">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-lg bg-cream p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-600 text-navy">{review.name}</p>
                  <p className="text-[9px] text-muted-foreground">{review.time}</p>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="mt-3 w-full rounded-lg border border-dashed border-flame/40 bg-flame-soft/60 px-2 py-1.5 text-[10px] font-600 text-flame"
          >
            Réponse assistée par IA
          </button>
        </div>

        <div className="grid gap-3 sm:col-span-2 sm:gap-4">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Campagnes
              </p>
              <Target className="h-3.5 w-3.5 text-flame" aria-hidden />
            </div>
            <div className="mt-3 space-y-2">
              {[
                { name: 'Google Ads — Local', state: 'Active', on: true },
                { name: 'Offre fidélité SMS', state: 'Planifiée', on: false },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-lg bg-cream px-2.5 py-2">
                  <span className="text-[11px] font-600 text-navy">{c.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-700 uppercase tracking-wide ${
                      c.on ? 'bg-flame-soft text-flame' : 'bg-border/70 text-muted-foreground'
                    }`}
                  >
                    {c.on ? <span className="h-1 w-1 rounded-full bg-flame pulse-dot" aria-hidden /> : null}
                    {c.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Acquisition
              </p>
              <Users className="h-3.5 w-3.5 text-flame" aria-hidden />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-cream p-2.5">
                <p className="font-display text-lg font-700 text-navy">312</p>
                <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Visites fiche</p>
              </div>
              <div className="rounded-lg bg-cream p-2.5">
                <p className="font-display text-lg font-700 text-navy">48</p>
                <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Contacts</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-navy px-2.5 py-2 text-primary-foreground">
              <MapPin className="h-3 w-3 shrink-0 text-flame" aria-hidden />
              <span className="truncate text-[10px] font-medium">Position Google Maps : Top 3 local</span>
            </div>
          </div>
        </div>
      </div>

      <p className="border-t border-border bg-cream px-4 py-2 text-center text-[10px] font-medium text-muted-foreground">
        Interface de démonstration — données fictives à titre d'illustration
      </p>
    </div>
  );
}
