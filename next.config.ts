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
};

export default nextConfig;
