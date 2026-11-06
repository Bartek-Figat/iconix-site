import type { NextConfig } from 'next';

// GitHub Pages serves the site from /<repository-name>/.
// The deploy workflow sets PAGES_BASE_PATH automatically; locally it is empty.
const basePath = process.env.PAGES_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',          // plain HTML/CSS/JS in ./out – no Node server needed
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
