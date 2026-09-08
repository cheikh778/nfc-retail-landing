import { getContent } from '@/content';
import { Footer } from './Footer';
import { Header } from './Header';

export function LegalPage({ title }: { title: string }) {
  const content = getContent();
  return (
    <div className="relative min-h-screen bg-background">
      <Header content={content.header} />
      <main className="px-5 py-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          <p className="max-w-[60ch] text-base leading-relaxed text-muted">{content.legalPlaceholder.body}</p>
        </div>
      </main>
      <Footer content={content.footer} />
    </div>
  );
}
