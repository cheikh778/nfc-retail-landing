import type { NextConfig } from 'next';

/**
 * Static export: `next build` emits a fully pre-rendered site in `out/`.
 * The landing has no server-side data needs — every route is static — so this
 * keeps the app deployable on any static host (and the existing Cloudflare
 * Pages + Worker setup). Moving to Vercel/SSR later = remove `output` + the
 * `images.unoptimized` line.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Let other devices on the LAN reach `next dev` (which binds to 0.0.0.0 by
  // default) without Next blocking its dev-only assets/endpoints as cross-origin.
  allowedDevOrigins: ['192.168.1.42'],
};

export default nextConfig;
