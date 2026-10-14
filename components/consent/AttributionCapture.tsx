'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { captureAttribution } from '@/lib/utm';

/** CRM attribution also survives entry through a legal or confirmation page. */
export function AttributionCapture() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => { captureAttribution(); }, [pathname, search]);
  return null;
}
