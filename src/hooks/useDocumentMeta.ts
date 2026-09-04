import { useEffect } from 'react';

interface DocumentMetaOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
}

function upsertMeta(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/** Lightweight, dependency-free title/meta/canonical manager for each route. */
export function useDocumentMeta({ title, description, canonicalUrl, robots }: DocumentMetaOptions): void {
  useEffect(() => {
    document.title = title;
    if (description) upsertMeta('description', description);
    if (robots) upsertMeta('robots', robots);
    if (canonicalUrl) upsertCanonical(canonicalUrl);
  }, [title, description, canonicalUrl, robots]);
}
