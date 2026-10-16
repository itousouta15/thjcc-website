import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // Embed small first-paint SVGs without changing regular next/image imports.
    const imageRule = config.module.rules.find(rule => rule.loader === "next-image-loader");
    if (imageRule) {
      imageRule.resourceQuery = {
        not: [...(imageRule.resourceQuery?.not ?? []), /inline/],
      };
    }
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /inline/,
      // Next.js sets a shared asset filename generator; use asset with forced
      // inlining so its generator remains compatible with Webpack's schema.
      type: "asset",
      parser: { dataUrlCondition: () => true },
    });
    return config;
  },
};

export default function configureNext(phase) {
  return {
    ...nextConfig,
    // Keep production builds from overwriting a running dev server's manifests.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
