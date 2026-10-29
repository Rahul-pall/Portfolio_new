import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static HTML export: `npm run build` writes ./out, which uploads to any host (cPanel, Vercel, Netlify).
  output: 'export',
  // Strict mode double-mounts effects in dev, which makes @react-three/a11y
  // create its DOM root twice and log an error. Production is unaffected.
  reactStrictMode: false,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ['three', '@splinetool/react-spline', '@splinetool/runtime'],
  webpack(config) {
    // @splinetool/react-spline only exports an "import" condition, which webpack's
    // client build does not match; point straight at the ESM file instead.
    config.resolve.alias['@splinetool/react-spline$'] = path.resolve(
      process.cwd(),
      'node_modules/@splinetool/react-spline/dist/react-spline.js',
    );
    return config;
  },
};

export default nextConfig;
