import { getContent } from '@/content';
import type { LegalDocument } from '@/content/types';
import { Footer } from './Footer';
import { Header } from './Header';

export function LegalPage({ title, document }: { title: string; document: LegalDocument }) {
  const content = getContent();
  return (
    <div className="relative min-h-screen bg-background">
      <Header content={content.header} />
      <main className="px-5 py-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          <p className="mb-10 text-sm text-muted-soft">Dernière mise à jour : {document.lastUpdated}</p>

          <div className="space-y-8">
            {document.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 font-display text-lg font-semibold text-navy">{section.heading}</h2>
                <div className="max-w-[65ch] space-y-3 text-base leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-1.5 pl-5">
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer content={content.footer} />
    </div>
  );
}
